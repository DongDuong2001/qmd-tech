import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { catalogService } from "@/modules/catalog/service";
import { cartService } from "@/modules/cart/service";
import { CartItem } from "@/shared/types";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";
import {
  CART_COOKIE_NAME,
  getCartCookieOptions,
  getClearCookieOptions,
  serializeCartData,
  deserializeCartData,
  CartCookieItem,
} from "@/shared/security/cookies";

async function resolveCartItems(cookieItems: CartCookieItem[]): Promise<CartItem[]> {
  if (cookieItems.length === 0) return [];

  const { products } = await catalogService.getProducts({ limit: 100 });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const cartItems: CartItem[] = [];
  for (const item of cookieItems) {
    const product = productMap.get(item.product_id);
    if (product) {
      cartItems.push({
        product_id: product.id,
        product,
        quantity: item.quantity,
        unit_price_vnd: product.price_vnd,
        total_price_vnd: product.price_vnd * item.quantity,
      });
    }
  }
  return cartItems;
}

// GET: Retrieve Cart via HttpOnly Cookie
export async function GET() {
  try {
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(CART_COOKIE_NAME)?.value;
    const cookieItems = deserializeCartData(rawCookie);

    const items = await resolveCartItems(cookieItems);
    const calculation = cartService.calculateCart(items);

    return NextResponse.json({
      success: true,
      items,
      calculation,
      count: items.reduce((acc, i) => acc + i.quantity, 0),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load cart";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Add Product to Cart
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, "cart_write", 30, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Thao tác giỏ hàng quá nhanh, vui lòng thử lại sau giây lát." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { product_id, quantity = 1 } = body;

    if (!product_id || typeof product_id !== "string" || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu sản phẩm không hợp lệ." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(CART_COOKIE_NAME)?.value;
    const cookieItems = deserializeCartData(rawCookie);

    const existingIndex = cookieItems.findIndex((i) => i.product_id === product_id);
    if (existingIndex > -1) {
      cookieItems[existingIndex].quantity += quantity;
    } else {
      cookieItems.push({ product_id, quantity });
    }

    const serialized = serializeCartData(cookieItems);
    cookieStore.set(CART_COOKIE_NAME, serialized, getCartCookieOptions());

    const items = await resolveCartItems(cookieItems);
    const calculation = cartService.calculateCart(items);

    return NextResponse.json({
      success: true,
      items,
      calculation,
      count: items.reduce((acc, i) => acc + i.quantity, 0),
      message: "Đã thêm sản phẩm vào giỏ hàng thành công!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update cart";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PUT: Update Product Quantity
export async function PUT(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, "cart_write", 30, 60);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Thao tác giỏ hàng quá nhanh." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { product_id, quantity } = body;

    if (!product_id || typeof product_id !== "string" || typeof quantity !== "number") {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(CART_COOKIE_NAME)?.value;
    let cookieItems = deserializeCartData(rawCookie);

    if (quantity <= 0) {
      cookieItems = cookieItems.filter((i) => i.product_id !== product_id);
    } else {
      const idx = cookieItems.findIndex((i) => i.product_id === product_id);
      if (idx > -1) {
        cookieItems[idx].quantity = quantity;
      }
    }

    const serialized = serializeCartData(cookieItems);
    cookieStore.set(CART_COOKIE_NAME, serialized, getCartCookieOptions());

    const items = await resolveCartItems(cookieItems);
    const calculation = cartService.calculateCart(items);

    return NextResponse.json({
      success: true,
      items,
      calculation,
      count: items.reduce((acc, i) => acc + i.quantity, 0),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update quantity";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Remove Item or Clear Entire Cart
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    const cookieStore = await cookies();

    if (!productId) {
      // Clear entire cart
      cookieStore.set(CART_COOKIE_NAME, "", getClearCookieOptions());
      return NextResponse.json({
        success: true,
        items: [],
        calculation: cartService.calculateCart([]),
        count: 0,
        message: "Đã xóa toàn bộ giỏ hàng.",
      });
    }

    const rawCookie = cookieStore.get(CART_COOKIE_NAME)?.value;
    const cookieItems = deserializeCartData(rawCookie).filter((i) => i.product_id !== productId);

    const serialized = serializeCartData(cookieItems);
    cookieStore.set(CART_COOKIE_NAME, serialized, getCartCookieOptions());

    const items = await resolveCartItems(cookieItems);
    const calculation = cartService.calculateCart(items);

    return NextResponse.json({
      success: true,
      items,
      calculation,
      count: items.reduce((acc, i) => acc + i.quantity, 0),
      message: "Đã xóa sản phẩm khỏi giỏ hàng.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete item";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
