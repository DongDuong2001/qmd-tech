import { describe, it, expect } from "vitest";
import { locationService } from "@/modules/location/service";

describe("LocationService - 34 Provinces Administrative Units", () => {
  it("returns exactly 34 provinces/cities", async () => {
    const provinces = await locationService.getProvinces();
    expect(Array.isArray(provinces)).toBe(true);
    expect(provinces.length).toBe(34);
  });

  it("contains major cities with correct codes", async () => {
    const provinces = await locationService.getProvinces();
    const hanoi = provinces.find((p) => p.name.includes("Hà Nội"));
    expect(hanoi).toBeDefined();
    expect(hanoi?.code).toBe(1);

    const hcm = provinces.find((p) => p.name.includes("Hồ Chí Minh"));
    expect(hcm).toBeDefined();
    expect(hcm?.code).toBe(79);
  });

  it("retrieves wards directly for a province without district level", async () => {
    // Province 1 (Hà Nội)
    const wards = await locationService.getWards(1);
    expect(Array.isArray(wards)).toBe(true);
    if (wards.length > 0) {
      expect(wards[0].province_code).toBe(1);
      expect(wards[0].division_type).toBeDefined();
    }
  });

  it("handles invalid or non-numeric province codes gracefully", async () => {
    const emptyWards = await locationService.getWards("invalid-code");
    expect(Array.isArray(emptyWards)).toBe(true);
    expect(emptyWards.length).toBe(0);
  });
});
