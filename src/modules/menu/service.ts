import fs from "fs";
import path from "path";
import { getServiceSupabase } from "@/shared/db/supabase";
import {
  MegaCategoryItem,
  DEFAULT_MEGA_MENU_CATEGORIES,
} from "@/components/navigation/megaMenuData";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "megaMenuCustom.json");

export class MenuService {
  private inMemoryCategories: MegaCategoryItem[] = JSON.parse(
    JSON.stringify(DEFAULT_MEGA_MENU_CATEGORIES)
  );
  private initialized = false;

  private sanitizeHref(href?: string): string {
    if (!href) return "/danh-muc";
    const trimmed = href.trim();
    if (trimmed.toLowerCase().startsWith("javascript:")) {
      return "/danh-muc";
    }
    return trimmed;
  }

  private sanitizeCategories(categories: MegaCategoryItem[]): MegaCategoryItem[] {
    return categories.map((cat, idx) => ({
      id: String(cat.id || `menu-cat-${idx + 1}`).trim(),
      slug: String(cat.slug || `cat-${idx + 1}`).toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-"),
      name: String(cat.name || `Danh mục ${idx + 1}`).trim(),
      iconName: cat.iconName ? String(cat.iconName).trim() : "Layers",
      badge: cat.badge ? String(cat.badge).trim() : undefined,
      badgeColor: cat.badgeColor || undefined,
      allUrl: this.sanitizeHref(cat.allUrl),
      subGroups: Array.isArray(cat.subGroups)
        ? cat.subGroups.map((g) => ({
            title: String(g.title || "Nhóm sản phẩm").trim(),
            items: Array.isArray(g.items)
              ? g.items.map((it) => ({
                  name: String(it.name || "Sản phẩm").trim(),
                  href: this.sanitizeHref(it.href),
                  badge: it.badge ? String(it.badge).trim() : undefined,
                  isHighlight: Boolean(it.isHighlight),
                }))
              : [],
          }))
        : [],
    }));
  }

  private loadFromFile(): MegaCategoryItem[] | null {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return this.sanitizeCategories(parsed);
        }
      }
    } catch (err) {
      console.warn("MenuService: error reading local menu file:", err);
    }
    return null;
  }

  private saveToFile(categories: MegaCategoryItem[]) {
    try {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(categories, null, 2), "utf-8");
    } catch (err) {
      console.warn("MenuService: error saving local menu file:", err);
    }
  }

  async getMenu(): Promise<MegaCategoryItem[]> {
    if (this.initialized) {
      return this.inMemoryCategories;
    }

    // 1. Try reading from Supabase
    try {
      const db = getServiceSupabase();
      const { data, error } = await db
        .from("mega_menu_settings")
        .select("categories")
        .eq("menu_key", "main_header_menu")
        .maybeSingle();

      if (!error && data?.categories && Array.isArray(data.categories) && data.categories.length > 0) {
        this.inMemoryCategories = this.sanitizeCategories(data.categories);
        this.initialized = true;
        return this.inMemoryCategories;
      }
    } catch {
      // Supabase table may not exist yet, fallback to file
    }

    // 2. Try reading from local data file
    const fileCategories = this.loadFromFile();
    if (fileCategories && fileCategories.length > 0) {
      this.inMemoryCategories = fileCategories;
      this.initialized = true;
      return this.inMemoryCategories;
    }

    // 3. Fallback to default
    this.inMemoryCategories = JSON.parse(JSON.stringify(DEFAULT_MEGA_MENU_CATEGORIES));
    this.initialized = true;
    return this.inMemoryCategories;
  }

  async updateMenu(categories: MegaCategoryItem[]): Promise<MegaCategoryItem[]> {
    if (!Array.isArray(categories) || categories.length === 0) {
      throw new Error("Danh sách danh mục không hợp lệ hoặc rỗng.");
    }

    const sanitized = this.sanitizeCategories(categories);
    this.inMemoryCategories = sanitized;
    this.initialized = true;

    // Persist to local file
    this.saveToFile(sanitized);

    // Persist to Supabase if table is available
    try {
      const db = getServiceSupabase();
      await db.from("mega_menu_settings").upsert(
        [
          {
            menu_key: "main_header_menu",
            categories: sanitized,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "menu_key" }
      );
    } catch (dbErr) {
      console.warn("MenuService: could not persist to database, file cache active:", dbErr);
    }

    return this.inMemoryCategories;
  }

  async resetMenu(): Promise<MegaCategoryItem[]> {
    const defaultData = JSON.parse(JSON.stringify(DEFAULT_MEGA_MENU_CATEGORIES));
    return this.updateMenu(defaultData);
  }
}

export const menuService = new MenuService();
