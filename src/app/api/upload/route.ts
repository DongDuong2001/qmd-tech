import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { supabase } from "@/shared/db/supabase";
import { ADMIN_COOKIE_NAME, AUTH_COOKIE_NAME } from "@/shared/security/cookies";
import { verifyAdminToken } from "@/shared/security/jwt";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateImageMagicBytes(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 16));
  if (bytes.length < 4) return false;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true;
  }
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return true;
  }
  // GIF: 47 49 46 38 ('GIF8')
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return true;
  }
  // WebP: RIFF (bytes 0-3) and WEBP (bytes 8-11)
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return true;
  }
  // AVIF: ftypavif or ftypmif1
  if (bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, "upload", 20, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Quá nhiều yêu cầu tải ảnh. Vui lòng thử lại sau giây lát." },
        { status: 429 }
      );
    }

    // 2. Authentication Check (Must be Admin or Authenticated User)
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const adminCheck = adminToken ? await verifyAdminToken(adminToken) : null;
    const isAdmin = adminCheck?.valid === true;

    let isUser = false;
    if (!isAdmin) {
      const userToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
      if (userToken) {
        const { data: userData } = await supabase.auth.getUser(userToken);
        if (userData?.user) isUser = true;
      }
    }

    if (!isAdmin && !isUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Bạn cần đăng nhập để tải tệp lên." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | Blob | null;
    const rawFolder = (formData.get("folder") as string) || "qmdtech/uploads";
    const folder = rawFolder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/\.\./g, "");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy tệp hình ảnh để tải lên." },
        { status: 400 }
      );
    }

    // 3. File Validation (Size, MIME type, and Magic Bytes signature)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Kích thước ảnh vượt quá giới hạn cho phép (tối đa 5MB)." },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Định dạng tệp không được hỗ trợ. Vui lòng tải ảnh định dạng JPG, PNG, WebP hoặc AVIF." },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    if (!validateImageMagicBytes(fileBuffer)) {
      return NextResponse.json(
        { success: false, error: "Nội dung tệp không phải định dạng hình ảnh hợp lệ." },
        { status: 400 }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "qmd_tech";

    if (!cloudName) {
      return NextResponse.json(
        { success: false, error: "Chưa cấu hình NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME trên server." },
        { status: 500 }
      );
    }

    // 1. If API Key and Secret are available, perform a robust Signed Upload
    if (apiKey && apiSecret) {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

      const serverFormData = new FormData();
      serverFormData.append("file", file);
      serverFormData.append("api_key", apiKey);
      serverFormData.append("timestamp", String(timestamp));
      serverFormData.append("folder", folder);
      serverFormData.append("signature", signature);

      const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const cloudRes = await fetch(endpoint, {
        method: "POST",
        body: serverFormData,
      });

      const data = await cloudRes.json();
      if (!cloudRes.ok || data.error) {
        throw new Error(data.error?.message || "Lỗi tải ảnh lên Cloudinary.");
      }

      return NextResponse.json({
        success: true,
        url: data.secure_url || data.url,
        secure_url: data.secure_url || data.url,
        public_id: data.public_id,
        format: data.format,
        bytes: data.bytes,
        width: data.width,
        height: data.height,
      });
    }

    // 2. Fallback to unsigned upload if no secret is present
    const unsignedFormData = new FormData();
    unsignedFormData.append("file", file);
    unsignedFormData.append("upload_preset", uploadPreset);
    unsignedFormData.append("folder", folder);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const cloudRes = await fetch(endpoint, {
      method: "POST",
      body: unsignedFormData,
    });

    const data = await cloudRes.json();
    if (!cloudRes.ok || data.error) {
      throw new Error(data.error?.message || "Lỗi tải ảnh lên Cloudinary.");
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url || data.url,
      secure_url: data.secure_url || data.url,
      public_id: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý tải ảnh.";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
