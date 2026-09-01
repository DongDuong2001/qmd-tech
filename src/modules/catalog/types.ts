import { Category, Product } from "@/shared/types";

export interface CatalogFilterParams {
  categoryId?: string;
  categorySlug?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
  page?: number;
  limit?: number;
}

export interface CatalogListResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  categories: Category[];
}
