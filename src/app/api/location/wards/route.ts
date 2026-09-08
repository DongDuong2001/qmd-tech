import { NextRequest, NextResponse } from "next/server";
import { locationService } from "@/modules/location/service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceCode = searchParams.get("province_code");

    if (!provinceCode) {
      return NextResponse.json(
        { success: false, error: "Thiếu tham số province_code." },
        { status: 400 }
      );
    }

    const wards = await locationService.getWards(provinceCode);
    return NextResponse.json(
      { success: true, count: wards.length, wards },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/location/wards error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy danh sách phường xã." },
      { status: 500 }
    );
  }
}
