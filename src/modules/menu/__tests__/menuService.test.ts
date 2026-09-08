import { describe, it, expect, beforeEach } from "vitest";
import { resolveMegaCategoryIcon, DEFAULT_MEGA_MENU_CATEGORIES } from "@/components/navigation/megaMenuData";
import { menuService } from "@/modules/menu/service";

describe("megaMenuData", () => {
  it("resolves default Lucide icon components correctly", () => {
    const icon1 = resolveMegaCategoryIcon("Cpu");
    expect(icon1).toBeDefined();

    const icon2 = resolveMegaCategoryIcon("HardDrive");
    expect(icon2).toBeDefined();

    // Unknown fallback
    const fallback = resolveMegaCategoryIcon("UnknownNonExistentIcon");
    expect(fallback).toBeDefined();
  });

  it("contains 12 default hardware categories", () => {
    expect(DEFAULT_MEGA_MENU_CATEGORIES.length).toBe(12);
    expect(DEFAULT_MEGA_MENU_CATEGORIES[0].id).toBe("vga");
    expect(DEFAULT_MEGA_MENU_CATEGORIES[0].name).toBe("VGA - Card Màn Hình");
  });
});

describe("menuService", () => {
  beforeEach(async () => {
    await menuService.resetMenu();
  });

  it("returns default mega menu categories on initialization", async () => {
    const menu = await menuService.getMenu();
    expect(Array.isArray(menu)).toBe(true);
    expect(menu.length).toBe(12);
    expect(menu[0].name).toBe("VGA - Card Màn Hình");
  });

  it("sanitizes dangerous javascript: hrefs when updating menu", async () => {
    const samplePayload = [
      {
        id: "test-cat",
        slug: "test-cat",
        name: "Test Cat",
        iconName: "Cpu",
        allUrl: "javascript:alert(1)",
        subGroups: [
          {
            title: "Test Group",
            items: [
              {
                name: "Exploit Link",
                href: "javascript:document.cookie",
              },
              {
                name: "Safe Link",
                href: "/danh-muc/safe-link",
                isHighlight: true,
              },
            ],
          },
        ],
      },
    ];

    const result = await menuService.updateMenu(samplePayload);
    expect(Array.isArray(result)).toBe(true);

    const updatedMenu = await menuService.getMenu();
    expect(updatedMenu.length).toBe(1);
    // Dangerous URL sanitized
    expect(updatedMenu[0].allUrl).toBe("/danh-muc");
    expect(updatedMenu[0].subGroups[0].items[0].href).toBe("/danh-muc");
    // Safe link preserved
    expect(updatedMenu[0].subGroups[0].items[1].href).toBe("/danh-muc/safe-link");
    expect(updatedMenu[0].subGroups[0].items[1].isHighlight).toBe(true);
  });

  it("resets menu back to defaults successfully", async () => {
    const resetResult = await menuService.resetMenu();
    expect(Array.isArray(resetResult)).toBe(true);
    expect(resetResult.length).toBe(12);

    const currentMenu = await menuService.getMenu();
    expect(currentMenu.length).toBe(12);
    expect(currentMenu[0].id).toBe("vga");
  });
});
