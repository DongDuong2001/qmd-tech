import { supabase } from "@/shared/db/supabase";
import { SiteSettings } from "@/shared/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  store_name: "QMD-Tech",
  slogan: "Gaming PC & Linh Kiện Máy Tính Chuyên Nghiệp",
  hotline: "1900.8888",
  hotline_support: "0988.888.888",
  support_email: "contact@qmdtech.vn",
  business_model: "online",
  business_model_text: "Bán hàng & Lắp ráp PC Online Toàn Quốc",
  headquarters_address: "Số 18 Phố Cầu Giấy, Quận Cầu Giấy, Hà Nội",
  has_showrooms: false,
  showrooms: [],
  bo_cong_thuong_registered: false,
  bo_cong_thuong_badge_url: "",
  bo_cong_thuong_link: "",
  bo_cong_thuong_license_no: "Đang làm thủ tục thông báo website thương mại điện tử với Bộ Công Thương",
  working_hours: "8:30 - 21:00 (Tất cả các ngày trong tuần)",
  facebook_url: "https://facebook.com/qmdtech",
  zalo_url: "https://zalo.me/0988888888",
  youtube_url: "https://youtube.com/@qmdtech",
  free_shipping_threshold_vnd: 5000000,
  updated_at: new Date().toISOString(),
};

export class SettingsService {
  private cachedSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };

  async getSettings(): Promise<SiteSettings> {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return this.cachedSettings;
      }

      this.cachedSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...data,
        showrooms: Array.isArray(data.showrooms) ? data.showrooms : [],
      };

      return this.cachedSettings;
    } catch {
      return this.cachedSettings;
    }
  }

  async updateSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
    const updated: SiteSettings = {
      ...this.cachedSettings,
      ...input,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from("site_settings")
          .update(updated)
          .eq("id", existing.id);

        if (error) {
          console.warn("Supabase settings update error, using cached state:", error.message);
        }
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert([updated]);

        if (error) {
          console.warn("Supabase settings insert error, using cached state:", error.message);
        }
      }
    } catch (err) {
      console.warn("Error persisting settings to DB, cached state updated:", err);
    }

    this.cachedSettings = updated;
    return updated;
  }
}

export const settingsService = new SettingsService();
