import { describe, it, expect } from "vitest";
import {
  getOptimizedCloudinaryUrl,
  CLOUDINARY_CONFIG,
} from "../cloudinary";

describe("Cloudinary Optimization Utilities", () => {
  it("should inject non-destructive quota-preserving transformations into Cloudinary URLs", () => {
    const rawUrl =
      "https://res.cloudinary.com/qmdtech/image/upload/v1725500000/qmdtech/blogs/sample-post.jpg";
    const optimized = getOptimizedCloudinaryUrl(rawUrl, {
      width: 1200,
      quality: "auto:good",
      format: "auto",
    });

    expect(optimized).toContain("/image/upload/f_auto,q_auto:good,w_1200,c_limit/");
    expect(optimized).toContain("sample-post.jpg");
  });

  it("should not double transform URLs that are already transformed", () => {
    const alreadyTransformed =
      "https://res.cloudinary.com/qmdtech/image/upload/f_auto,q_auto,w_800/v1725500000/sample.jpg";
    const result = getOptimizedCloudinaryUrl(alreadyTransformed);
    expect(result).toBe(alreadyTransformed);
  });

  it("should return non-Cloudinary URLs untouched", () => {
    const externalUrl = "https://images.unsplash.com/photo-1587202372634";
    expect(getOptimizedCloudinaryUrl(externalUrl)).toBe(externalUrl);
    expect(getOptimizedCloudinaryUrl("")).toBe("");
  });

  it("should have valid configuration interface", () => {
    expect(CLOUDINARY_CONFIG).toHaveProperty("cloudName");
    expect(CLOUDINARY_CONFIG).toHaveProperty("uploadPreset");
  });
});
