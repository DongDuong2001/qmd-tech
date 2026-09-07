import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { supabase } from "@/shared/db/supabase";
import { ADMIN_COOKIE_NAME, AUTH_COOKIE_NAME } from "@/shared/security/cookies";
import { verifyAdminToken } from "@/shared/security/jwt";
import { checkRateLimit } from "@/shared/security/rateLimiter";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
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

    // 3. File Validation (Size and MIME type)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "Kích thước ảnh vượt quá giới hạn cho phép (tối đa 5MB)." },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Định dạng tệp không được hỗ trợ. Vui lòng tải ảnh định dạng JPG, PNG, WebP, AVIF hoặc SVG." },
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
