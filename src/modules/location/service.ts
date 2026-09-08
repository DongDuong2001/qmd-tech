import fs from "fs";
import path from "path";

export interface Province34 {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code?: number;
}

export interface WardItem {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  province_code: number;
}

const FALLBACK_DATA_PATH = path.join(process.cwd(), "src", "data", "vietnamProvinces34.json");

export class LocationService {
  private provincesCache: Province34[] | null = null;
  private wardsCache: Map<number, WardItem[]> = new Map();
  private cacheExpiresAt = 0;
  private readonly CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

  private loadFallbackProvinces(): Province34[] {
    try {
      if (fs.existsSync(FALLBACK_DATA_PATH)) {
        const raw = fs.readFileSync(FALLBACK_DATA_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("LocationService: failed reading local fallback file:", err);
    }
    return [];
  }

  async getProvinces(): Promise<Province34[]> {
    const now = Date.now();
    if (this.provincesCache && this.cacheExpiresAt > now) {
      return this.provincesCache;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch("https://provinces.open-api.vn/api/v2/p/", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const list: Province34[] = data.map((p: any) => ({
            code: Number(p.code),
            name: String(p.name || "").trim(),
            division_type: String(p.division_type || "tỉnh"),
            codename: String(p.codename || ""),
            phone_code: p.phone_code ? Number(p.phone_code) : undefined,
          }));

          this.provincesCache = list;
          this.cacheExpiresAt = now + this.CACHE_TTL_MS;
          return list;
        }
      }
    } catch (fetchErr) {
      console.warn("LocationService: online fetch failed, using fallback:", fetchErr);
    }

    // Fallback to static 34-province dataset
    const fallback = this.loadFallbackProvinces();
    if (fallback.length > 0) {
      this.provincesCache = fallback;
      this.cacheExpiresAt = now + this.CACHE_TTL_MS;
      return fallback;
    }

    return [];
  }

  async getWards(provinceCodeInput: number | string): Promise<WardItem[]> {
    const code = Number(provinceCodeInput);
    if (!code || isNaN(code)) return [];

    if (this.wardsCache.has(code)) {
      return this.wardsCache.get(code)!;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`https://provinces.open-api.vn/api/v2/p/${code}?depth=2`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.wards)) {
          const wards: WardItem[] = data.wards.map((w: any) => ({
            code: Number(w.code),
            name: String(w.name || "").trim(),
            division_type: String(w.division_type || "phường"),
            codename: String(w.codename || ""),
            province_code: code,
          }));

          this.wardsCache.set(code, wards);
          return wards;
        }
      }
    } catch (err) {
      console.warn(`LocationService: failed fetching wards for province ${code}:`, err);
    }

    return [];
  }
}

export const locationService = new LocationService();
