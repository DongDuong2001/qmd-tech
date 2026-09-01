import React from "react";
import { CustomPcBuilder } from "@/components/builder/CustomPcBuilder";

export const metadata = {
  title: "Xây Dựng Cấu Hình PC | QMD-Tech Custom PC Builder",
  description:
    "Công cụ build PC tương thích phần cứng theo thời gian thực. Tự động kiểm tra socket, chuẩn RAM, điện áp nguồn và kích thước case.",
};

export default function BuildPcPage() {
  return <CustomPcBuilder />;
}
