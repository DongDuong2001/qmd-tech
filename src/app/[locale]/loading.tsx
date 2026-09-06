import React from "react";
import { TechLoader } from "@/components/common/TechLoader";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-[#F8FAFC]">
      <TechLoader
        label="QMD-TECH"
        sublabel="Đang xử lý và tải trang..."
      />
    </div>
  );
}
