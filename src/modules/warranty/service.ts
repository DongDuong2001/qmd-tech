import { getServiceSupabase } from "@/shared/db/supabase";
import {
  CreateRMATicketInput,
  ProductSerial,
  WarrantyLookupResult,
  WarrantyTicket,
} from "./types";

export class WarrantyService {
  /**
   * Looks up warranty information and associated RMA tickets by serial number or phone
   */
  async lookupWarranty(query: string): Promise<WarrantyLookupResult> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return {
        serial: null,
        tickets: [],
        isValid: false,
        daysRemaining: 0,
        message: "Vui long nhap so Serial hoac So dien thoai hop le.",
      };
    }

    try {
      const db = getServiceSupabase();

      // 1. Try finding by serial number first
      let { data: serial } = await db
        .from("product_serials")
        .select("*, product:products(id, name, slug)")
        .ilike("serial_number", cleanQuery)
        .maybeSingle();

      // 1b. If not found by serial, try customer phone
      if (!serial) {
        const { data: serialByPhone } = await db
          .from("product_serials")
          .select("*, product:products(id, name, slug)")
          .eq("customer_phone", cleanQuery)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        serial = serialByPhone;
      }

      // 2. Fetch associated RMA tickets
      let tickets: WarrantyTicket[] = [];
      const serialNum = serial ? serial.serial_number : cleanQuery;

      const { data: ticketData } = await db
        .from("warranty_tickets")
        .select("*")
        .or(`serial_number.ilike.${serialNum},customer_phone.eq.${cleanQuery}`)
        .order("created_at", { ascending: false });

      if (ticketData) {
        tickets = ticketData as WarrantyTicket[];
      }

      if (!serial) {
        return {
          serial: null,
          tickets,
          isValid: false,
          daysRemaining: 0,
          message:
            tickets.length > 0
              ? "Tim thay phieu bao hanh theo thong tin lien he."
              : "Khong tim thay thong tin bao hanh cho ma so nay.",
        };
      }

      // Calculate warranty validity
      let isValid = false;
      let daysRemaining = 0;

      if (serial.warranty_expires_at) {
        const expiresAt = new Date(serial.warranty_expires_at).getTime();
        const now = Date.now();
        const diffMs = expiresAt - now;
        if (diffMs > 0) {
          isValid = true;
          daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        }
      } else if (serial.status === "in_stock") {
        isValid = true;
        daysRemaining = (serial.warranty_months || 36) * 30;
      }

      return {
        serial: serial as ProductSerial,
        tickets,
        isValid,
        daysRemaining,
        message: isValid
          ? `Bao hanh con hieu luc (con ${daysRemaining} ngay).`
          : "Linh kien da het han bao hanh chinh hang.",
      };
    } catch (err) {
      console.error("WarrantyService.lookupWarranty error:", err);
      return {
        serial: null,
        tickets: [],
        isValid: false,
        daysRemaining: 0,
        message: "Loi he thong khi tra cuu bao hanh.",
      };
    }
  }

  /**
   * Creates a new RMA Warranty Ticket
   */
  async createRMATicket(input: CreateRMATicketInput): Promise<WarrantyTicket> {
    const db = getServiceSupabase();

    // Generate readable RMA ticket code: RMA-YYYYMM-XXXX
    const dateStr = new Date().toISOString().slice(0, 7).replace("-", "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `RMA-${dateStr}-${randomSuffix}`;

    const { data, error } = await db
      .from("warranty_tickets")
      .insert({
        ticket_code: ticketCode,
        customer_name: input.customer_name,
        customer_phone: input.customer_phone,
        customer_email: input.customer_email || null,
        serial_number: input.serial_number.trim().toUpperCase(),
        product_name: input.product_name,
        issue_description: input.issue_description,
        technician_notes: input.technician_notes || null,
        vendor_rma_code: input.vendor_rma_code || null,
        status: "received",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Khong the tao phieu bao hanh: ${error?.message}`);
    }

    return data as WarrantyTicket;
  }

  /**
   * Updates an existing RMA Ticket status or technician notes
   */
  async updateRMATicket(
    ticketId: string,
    updates: Partial<WarrantyTicket>
  ): Promise<WarrantyTicket | null> {
    const db = getServiceSupabase();
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await db
      .from("warranty_tickets")
      .update(payload)
      .eq("id", ticketId)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data as WarrantyTicket;
  }

  /**
   * Lists RMA tickets with filters
   */
  async listRMATickets(params?: { status?: string; search?: string }): Promise<WarrantyTicket[]> {
    const db = getServiceSupabase();
    let query = db
      .from("warranty_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (params?.status) {
      query = query.eq("status", params.status);
    }

    if (params?.search) {
      const s = params.search.trim();
      query = query.or(
        `ticket_code.ilike.%${s}%,customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%,serial_number.ilike.%${s}%`
      );
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as WarrantyTicket[];
  }

  /**
   * Allocates a serial number to a sold order
   */
  async allocateSerialToOrder(
    serialNumber: string,
    orderId: string,
    customerPhone?: string,
    warrantyMonths = 36
  ): Promise<ProductSerial | null> {
    const db = getServiceSupabase();
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + warrantyMonths);

    const { data, error } = await db
      .from("product_serials")
      .update({
        order_id: orderId,
        customer_phone: customerPhone || null,
        status: "sold",
        sold_at: now.toISOString(),
        warranty_expires_at: expiresAt.toISOString(),
      })
      .ilike("serial_number", serialNumber.trim())
      .select()
      .maybeSingle();

    if (error || !data) return null;
    return data as ProductSerial;
  }
}

export const warrantyService = new WarrantyService();
