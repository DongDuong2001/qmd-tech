import React from "react";
import { TechLoader } from "@/components/common/TechLoader";

export default function AdminLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#F8FAFC]">
      <TechLoader
        label="QMD ADMIN PORTAL"
        sublabel="Đang khởi tạo phiên quản trị bảo mật..."
      />
    </div>
  );
}
