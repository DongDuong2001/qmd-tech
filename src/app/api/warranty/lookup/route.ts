import { NextRequest, NextResponse } from "next/server";
import { warrantyService } from "@/modules/warranty/service";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng cung cấp Số Serial hoặc Số điện thoại để tra cứu.",
        },
        { status: 400 }
      );
    }

    const result = await warrantyService.lookupWarranty(q);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi tra cứu thông tin bảo hành.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
