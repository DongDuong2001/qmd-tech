import { Order } from "@/shared/types";
import { CreateOrderInput } from "./types";
import { cartService } from "../cart/service";
import { eventBus } from "@/shared/events/eventBus";
import { supabase } from "@/shared/db/supabase";

export class OrderService {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const calc = cartService.calculateCart(input.items);
    const orderCode = `QMD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `order-${Date.now()}`;

    const order: Order = {
      id: orderId,
      order_code: orderCode,
      user_id: input.userId || null,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      shipping_address: input.shippingAddress,
      shipping_city: input.shippingCity,
      shipping_district: input.shippingDistrict,
      status: "pending",
      subtotal_vnd: calc.cart.subtotal_vnd,
      shipping_fee_vnd: calc.cart.shipping_fee_vnd,
      discount_vnd: calc.cart.discount_vnd,
      total_vnd: calc.cart.total_vnd,
      payment_method: input.paymentMethod,
      payment_status: input.paymentMethod === "cod" ? "unpaid" : "unpaid",
      shipping_provider: input.shippingProvider || "ghn",
      custom_build_id: input.customBuildId,
      notes: input.notes,
      created_at: new Date().toISOString(),
      items: input.items,
    };

    try {
      await supabase.from("orders").insert({
        id: order.id,
        order_code: order.order_code,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        shipping_city: order.shipping_city,
        shipping_district: order.shipping_district,
        status: order.status,
        subtotal_vnd: order.subtotal_vnd,
        shipping_fee_vnd: order.shipping_fee_vnd,
        discount_vnd: order.discount_vnd,
        total_vnd: order.total_vnd,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        shipping_provider: order.shipping_provider,
        custom_build_id: order.custom_build_id,
        notes: order.notes,
      });
    } catch {
      // Offline fallback
    }

    await eventBus.emit("order:created", {
      orderId: order.id,
      orderCode: order.order_code,
      totalVnd: order.total_vnd,
      customerEmail: order.customer_email,
    });

    return order;
  }

  async getOrderByCode(code: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, product:products(*))")
        .eq("order_code", code)
        .single();

      if (!error && data) {
        return data as Order;
      }
    } catch {
      // Fallback
    }
    return null;
  }

  async markOrderPaid(orderId: string, transactionId: string, paymentMethod: string): Promise<boolean> {
    try {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_transaction_id: transactionId,
          status: "processing",
        })
        .eq("id", orderId);
    } catch {
      // Fallback
    }

    await eventBus.emit("order:paid", {
      orderId,
      paymentMethod,
      transactionId,
    });

    return true;
  }
}

export const orderService = new OrderService();
