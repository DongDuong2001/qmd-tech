import { NextResponse } from "next/server";
import { locationService } from "@/modules/location/service";

export async function GET() {
  try {
    const provinces = await locationService.getProvinces();
    return NextResponse.json(
      { success: true, count: provinces.length, provinces },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/location/provinces error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy danh sách tỉnh thành." },
      { status: 500 }
    );
  }
}
