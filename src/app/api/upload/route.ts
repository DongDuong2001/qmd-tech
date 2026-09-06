import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | Blob | null;
    const folder = (formData.get("folder") as string) || "qmdtech/uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy tệp hình ảnh để tải lên." },
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
