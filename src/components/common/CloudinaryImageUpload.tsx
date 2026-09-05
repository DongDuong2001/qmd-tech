"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Link as LinkIcon,
  RefreshCw,
  Zap,
} from "lucide-react";
import {
  compressImageClient,
  uploadToCloudinary,
} from "@/shared/lib/cloudinary";

interface CloudinaryImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  description?: string;
  maxSizeMB?: number;
  placeholder?: string;
}

export function CloudinaryImageUpload({
  value,
  onChange,
  folder = "qmdtech/uploads",
  label = "Hình ảnh",
  description = "Hỗ trợ PNG, JPG, WEBP. Tự động tối ưu dung lượng trước khi lưu trữ.",
  maxSizeMB = 5,
  placeholder = "https://...",
}: CloudinaryImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [compressStats, setCompressStats] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [manualUrl, setManualUrl] = useState(value);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setCompressStats(null);

    // Validate size limit (before compression)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`Kích thước tệp vượt quá ${maxSizeMB}MB. Vui lòng chọn tệp nhỏ hơn.`);
      return;
    }

    // Validate format
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Định dạng tệp không hợp lệ. Vui lòng chọn tệp hình ảnh.");
      return;
    }

    try {
      setIsUploading(true);

      // 1. Quota preservation: Client-side compression
      const { blob, fileName, originalSize, compressedSize, savingsPercentage } =
        await compressImageClient(file);

      if (savingsPercentage > 0) {
        const origKB = Math.round(originalSize / 1024);
        const compKB = Math.round(compressedSize / 1024);
        setCompressStats(`Tối ưu quota: Giảm ${savingsPercentage}% (${origKB}KB -> ${compKB}KB)`);
      }

      // 2. Upload to Cloudinary
      const res = await uploadToCloudinary(blob, folder, fileName);
      onChange(res.secure_url || res.url);
      setManualUrl(res.secure_url || res.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tải ảnh lên thất bại.";
      setErrorMsg(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualApply = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setErrorMsg(null);
    }
  };

  return (
    <div className="space-y-2 text-xs">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          {label && <label className="block font-bold text-[#475569]">{label}</label>}
          {description && <p className="text-[10px] text-[#94A3B8]">{description}</p>}
        </div>

        <div className="flex items-center rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-0.5 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
              mode === "upload"
                ? "bg-[#0063FD] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Upload className="h-3 w-3" />
            <span>Tải Lên</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
              mode === "url"
                ? "bg-[#0063FD] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>Nhập URL</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] p-2.5 text-[11px] text-[#B91C1C] flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Compression Savings Notice */}
      {compressStats && (
        <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-2 text-[10px] text-[#0063FD] flex items-center gap-1.5 font-bold">
          <Zap className="h-3.5 w-3.5 text-[#0063FD]" />
          <span>{compressStats}</span>
        </div>
      )}

      {/* Mode 1: Cloudinary Upload Dropzone */}
      {mode === "upload" ? (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {!value ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-[#0063FD] bg-[#EFF6FF]"
                  : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#0063FD] hover:bg-white"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-3">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#0063FD]" />
                  <span className="font-bold text-[#0F172A]">
                    Đang nén và tải ảnh lên Cloudinary...
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    Tối ưu dung lượng và định dạng WebP tự động
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#0063FD]">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-[#0F172A]">
                    Kéo thả ảnh vào đây hoặc nhấp để chọn tệp
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    Tối đa {maxSizeMB}MB • Tự động nén bảo vệ Quota Free Tier
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Uploaded Preview State */
            <div className="relative rounded-xl border border-[#CBD5E1] bg-white p-2 flex items-center gap-3">
              <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#0F172A] shrink-0">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#16A34A]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Đã tải lên Cloudinary
                </span>
                <p className="text-[10px] text-[#64748B] truncate font-mono mt-0.5">{value}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-2.5 py-1.5 text-[10px] font-bold text-[#0F172A] hover:border-[#0063FD] hover:text-[#0063FD] transition-colors"
                >
                  Thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setManualUrl("");
                  }}
                  className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Xóa ảnh"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Direct URL Input */
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-[#CBD5E1] bg-white p-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0063FD] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleManualApply}
              className="rounded-lg bg-[#0063FD] px-3.5 py-2 font-bold text-white hover:bg-[#0052D4] transition-colors text-xs shrink-0"
            >
              Áp dụng
            </button>
          </div>

          {value && (
            <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#0F172A]">
              <Image
                src={value}
                alt="Preview"
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
