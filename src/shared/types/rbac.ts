/**
 * Enterprise Role-Based Access Control (RBAC) Contracts
 */

export type AdminRole =
  | "super_admin"
  | "admin"
  | "warehouse"
  | "technician"
  | "support"
  | "accountant"
  | "marketing";

export type AdminPermission =
  | "orders:read"
  | "orders:write"
  | "orders:status"
  | "orders:delete"
  | "inventory:read"
  | "inventory:write"
  | "products:read"
  | "products:write"
  | "products:delete"
  | "warranty:read"
  | "warranty:write"
  | "payments:read"
  | "payments:reconcile"
  | "audit:read"
  | "users:manage"
  | "marketing:write"
  | "settings:write";

export const ROLE_PERMISSIONS_MAP: Record<AdminRole, readonly AdminPermission[]> = {
  super_admin: [
    "orders:read",
    "orders:write",
    "orders:status",
    "orders:delete",
    "inventory:read",
    "inventory:write",
    "products:read",
    "products:write",
    "products:delete",
    "warranty:read",
    "warranty:write",
    "payments:read",
    "payments:reconcile",
    "audit:read",
    "users:manage",
    "marketing:write",
    "settings:write",
  ],
  admin: [
    "orders:read",
    "orders:write",
    "orders:status",
    "orders:delete",
    "inventory:read",
    "inventory:write",
    "products:read",
    "products:write",
    "products:delete",
    "warranty:read",
    "warranty:write",
    "payments:read",
    "payments:reconcile",
    "audit:read",
    "users:manage",
    "marketing:write",
    "settings:write",
  ],
  warehouse: [
    "orders:read",
    "orders:status",
    "inventory:read",
    "inventory:write",
    "products:read",
    "warranty:read",
  ],
  technician: [
    "orders:read",
    "orders:status",
    "warranty:read",
    "warranty:write",
    "inventory:read",
    "products:read",
  ],
  support: [
    "orders:read",
    "orders:write",
    "orders:status",
    "warranty:read",
    "products:read",
  ],
  accountant: [
    "orders:read",
    "payments:read",
    "payments:reconcile",
    "audit:read",
  ],
  marketing: [
    "products:read",
    "marketing:write",
  ],
};

export function hasPermission(role: string, permission: AdminPermission): boolean {
  const normalizedRole = (role || "").toLowerCase() as AdminRole;
  const permissions = ROLE_PERMISSIONS_MAP[normalizedRole];
  if (!permissions) return false;
  return permissions.includes(permission);
}

export function getRolePermissions(role: string): readonly AdminPermission[] {
  const normalizedRole = (role || "").toLowerCase() as AdminRole;
  return ROLE_PERMISSIONS_MAP[normalizedRole] || [];
}

export interface AdminUserRecord {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuditLogEntry {
  id: string;
  admin_user_id?: string | null;
  admin_user_email?: string | null;
  admin_role?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}
