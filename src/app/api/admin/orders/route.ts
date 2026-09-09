import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/shared/db/supabase";
import { requireAdmin } from "@/shared/security/adminAuth";
import { Order } from "@/shared/types";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("orders")
      .select("*, order_items(*, product:products(*))")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/admin/orders error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: (data || []) as Order[] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Loi truy van danh sach don hang.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const body = await req.json();
    const { id, status, tracking_code, notes } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "ID don hang khong hop le." }, { status: 400 });
    }

    const allowedStatuses: Order["status"][] = ["pending", "processing", "shipping", "completed", "cancelled"];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Trang thai don hang khong hop le." }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {};
    if (status) updatePayload.status = status;
    if (tracking_code !== undefined) updatePayload.tracking_code = tracking_code;
    if (notes !== undefined) updatePayload.notes = notes;

    const db = getServiceSupabase();
    const { data, error } = await db
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select("*, order_items(*, product:products(*))")
      .single();

    if (error) {
      console.error("PUT /api/admin/orders error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data as Order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Loi cap nhat don hang.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
