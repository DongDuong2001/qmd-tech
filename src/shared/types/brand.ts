// ========================================================================
// QMD-Tech Hardware Brand Identity & Trademark Compliance Contract
// ========================================================================

export type BrandUsageLevel =
  | "partner_approval_required"
  | "reseller_limited_license"
  | "brand_guidelines_compliant";

export interface HardwareBrand {
  id: string;
  name: string;
  official_website: string;
  media_center_url?: string;
  category: string;
  format: string;
  usage_level: BrandUsageLevel;
  commercial_note: string;
  local_asset_path: string;
  primary_hex?: string;
}
