import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/modules/catalog/service";
import { handleApiError } from "@/shared/middleware/errorHandler";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const search = searchParams.get("q") || undefined;
    const inStockOnly = searchParams.get("inStock") === "true";
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    const result = await catalogService.getProducts({
      categorySlug,
      brand,
      search,
      inStockOnly,
      sortBy,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
