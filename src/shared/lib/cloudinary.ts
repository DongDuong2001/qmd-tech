/**
 * Cloudinary Helper & Optimization Utilities
 * Designed to preserve Free Tier quota via:
 * 1. Client-side canvas compression before network upload (saves storage & bandwidth credits)
 * 2. Automatic delivery transformations (f_auto, q_auto:good, w_limit)
 * 3. Structured folder routing (qmdtech/blogs, qmdtech/products, qmdtech/banners)
 */

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "qmdtech_preset",
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
};

export interface OptimizationOptions {
  width?: number;
  height?: number;
  quality?: "auto" | "auto:eco" | "auto:good" | "auto:best" | number;
  crop?: "limit" | "fill" | "fit" | "scale" | "thumb";
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}

/**
 * Injects non-destructive URL transformations into Cloudinary URLs
 * Delivers optimized WebP/AVIF without storing duplicate high-res files
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: OptimizationOptions = {}
): string {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;

  const {
    width = 1200,
    height,
    quality = "auto:good",
    crop = "limit",
    format = "auto",
  } = options;

  // Build transformation segments
  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    `c_${crop}`,
  ]
    .filter(Boolean)
    .join(",");

  // Insert transformation after /upload/
  if (url.includes("/image/upload/")) {
    // Avoid double transforming if already transformed
    if (url.includes("/image/upload/f_") || url.includes("/image/upload/c_") || url.includes("/image/upload/q_")) {
      return url;
    }
    return url.replace("/image/upload/", `/image/upload/${transforms}/`);
  }

  return url;
}

export interface CompressResult {
  blob: Blob;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
}

/**
 * Pre-processes and compresses oversized images in the browser before upload
 * Reduces 5MB-10MB camera shots to ~150KB-350KB, saving up to 90% of free storage quota
 */
export async function compressImageClient(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<CompressResult> {
  const originalSize = file.size;

  // If file is SVG or gif, skip compression to maintain vector/animation
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return {
      blob: file,
      fileName: file.name,
      originalSize,
      compressedSize: originalSize,
      savingsPercentage: 0,
    };
  }

  // If already under 250KB, don't recompress
  if (originalSize < 250 * 1024) {
    return {
      blob: file,
      fileName: file.name,
      originalSize,
      compressedSize: originalSize,
      savingsPercentage: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio constraint
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve({
            blob: file,
            fileName: file.name,
            originalSize,
            compressedSize: originalSize,
            savingsPercentage: 0,
          });
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if supported, or high-efficiency jpeg
        const outputType = "image/webp";

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve({
                blob: file,
                fileName: file.name,
                originalSize,
                compressedSize: originalSize,
                savingsPercentage: 0,
              });
            }

            const compressedSize = blob.size;
            const savings = Math.max(
              0,
              Math.round(((originalSize - compressedSize) / originalSize) * 100)
            );

            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const newName = `${baseName}.webp`;

            resolve({
              blob,
              fileName: newName,
              originalSize,
              compressedSize,
              savingsPercentage: savings,
            });
          },
          outputType,
          quality
        );
      };

      img.onerror = () => reject(new Error("Không thể xử lý định dạng hình ảnh này."));
    };

    reader.onerror = () => reject(new Error("Lỗi khi đọc tệp từ thiết bị."));
  });
}

export interface CloudinaryUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
}

/**
 * Direct unsigned upload to Cloudinary with quota protection and error handling
 */
export async function uploadToCloudinary(
  fileOrBlob: File | Blob,
  folder = "qmdtech/uploads",
  fileName?: string
): Promise<CloudinaryUploadResponse> {
  const cloudName = CLOUDINARY_CONFIG.cloudName;
  const uploadPreset = CLOUDINARY_CONFIG.uploadPreset;

  if (!cloudName) {
    throw new Error(
      "Chưa cấu hình NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME trong tệp .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", fileOrBlob, fileName || "upload.webp");
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    const errorMsg =
      data.error?.message ||
      "Lỗi khi tải ảnh lên Cloudinary. Vui lòng kiểm tra upload_preset và dung lượng.";
    throw new Error(errorMsg);
  }

  // Generate automatically optimized delivery URL
  const optimizedUrl = getOptimizedCloudinaryUrl(data.secure_url || data.url);

  return {
    url: optimizedUrl,
    secure_url: optimizedUrl,
    public_id: data.public_id,
    format: data.format,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
  };
}
