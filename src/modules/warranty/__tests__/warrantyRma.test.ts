import { describe, it, expect, vi, beforeEach } from "vitest";
import { warrantyService } from "../service";
import * as supabaseModule from "@/shared/db/supabase";

describe("Enterprise Warranty & RMA Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("looks up warranty by serial number and calculates validity", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 120);

    const mockSerial = {
      id: "sn-1",
      product_id: "prod-gpu-1",
      serial_number: "RTX4090-SN-9999",
      status: "sold",
      customer_phone: "0988889999",
      warranty_months: 36,
      warranty_expires_at: futureDate.toISOString(),
      product: { id: "prod-gpu-1", name: "ASUS ROG Strix RTX 4090", slug: "asus-rog-rtx-4090" },
    };

    const mockTickets = [
      {
        id: "rma-1",
        ticket_code: "RMA-202609-1234",
        status: "received",
        serial_number: "RTX4090-SN-9999",
      },
    ];

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "product_serials") {
          return {
            select: vi.fn(() => ({
              ilike: vi.fn(() => ({
                maybeSingle: vi.fn().mockResolvedValue({ data: mockSerial, error: null }),
              })),
            })),
          };
        }
        if (table === "warranty_tickets") {
          return {
            select: vi.fn(() => ({
              or: vi.fn(() => ({
                order: vi.fn().mockResolvedValue({ data: mockTickets, error: null }),
              })),
            })),
          };
        }
        return {};
      }),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const result = await warrantyService.lookupWarranty("RTX4090-SN-9999");

    expect(result.isValid).toBe(true);
    expect(result.daysRemaining).toBeGreaterThanOrEqual(119);
    expect(result.serial?.serial_number).toBe("RTX4090-SN-9999");
    expect(result.tickets.length).toBe(1);
    expect(result.tickets[0].ticket_code).toBe("RMA-202609-1234");
  });

  it("creates an RMA ticket with formatted ticket code", async () => {
    let insertedTicket: Record<string, unknown> | null = null;

    const mockSupabase = {
      from: vi.fn(() => ({
        insert: vi.fn((data: Record<string, unknown>) => {
          insertedTicket = { ...data, id: "ticket-uuid-1" };
          return {
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: insertedTicket, error: null }),
            })),
          };
        }),
      })),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const ticket = await warrantyService.createRMATicket({
      customer_name: "Nguyen Van A",
      customer_phone: "0912345678",
      serial_number: "SN-CPU-7788",
      product_name: "AMD Ryzen 7 7800X3D",
      issue_description: "Khong len nguon",
    });

    expect(ticket.id).toBe("ticket-uuid-1");
    expect(ticket.ticket_code).toMatch(/^RMA-\d{6}-\d{4}$/);
    expect(ticket.status).toBe("received");
    expect(insertedTicket).not.toBeNull();
  });

  it("allocates a serial number to a completed order", async () => {
    const updatedSerial = {
      id: "sn-alloc-1",
      serial_number: "MAIN-B650-1234",
      order_id: "ord-123",
      status: "sold",
      customer_phone: "0988776655",
    };

    const mockSupabase = {
      from: vi.fn(() => ({
        update: vi.fn(() => ({
          ilike: vi.fn(() => ({
            select: vi.fn(() => ({
              maybeSingle: vi.fn().mockResolvedValue({ data: updatedSerial, error: null }),
            })),
          })),
        })),
      })),
    };

    vi.spyOn(supabaseModule, "getServiceSupabase").mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseModule.getServiceSupabase>);

    const res = await warrantyService.allocateSerialToOrder("MAIN-B650-1234", "ord-123", "0988776655", 36);

    expect(res).not.toBeNull();
    expect(res?.status).toBe("sold");
    expect(res?.order_id).toBe("ord-123");
  });
});
