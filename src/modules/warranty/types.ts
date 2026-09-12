/**
 * Warranty & RMA Domain Types
 */

export type SerialStatus =
  | "in_stock"
  | "allocated"
  | "sold"
  | "rma_returned"
  | "defective";

export interface ProductSerial {
  id: string;
  product_id: string;
  serial_number: string;
  status: SerialStatus;
  order_id?: string | null;
  customer_phone?: string | null;
  warranty_months: number;
  sold_at?: string | null;
  warranty_expires_at?: string | null;
  notes?: string | null;
  created_at: string;
  product?: {
    id: string;
    name: string;
    slug?: string;
  };
}

export type RMAStatus =
  | "received"
  | "testing"
  | "sent_to_vendor"
  | "vendor_returned"
  | "repaired"
  | "replaced"
  | "completed"
  | "rejected";

export interface WarrantyTicket {
  id: string;
  ticket_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  serial_number: string;
  product_name: string;
  issue_description: string;
  status: RMAStatus;
  technician_notes?: string | null;
  vendor_rma_code?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRMATicketInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  serial_number: string;
  product_name: string;
  issue_description: string;
  technician_notes?: string;
  vendor_rma_code?: string;
}

export interface WarrantyLookupResult {
  serial: ProductSerial | null;
  tickets: WarrantyTicket[];
  isValid: boolean;
  daysRemaining: number;
  message?: string;
}
