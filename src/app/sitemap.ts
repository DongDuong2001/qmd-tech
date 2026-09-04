import { MetadataRoute } from "next";
import { catalogService } from "@/modules/catalog/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qmdtech.vercel.app";
  const locales = ["vi", "en"];

  const staticRoutes = [
    "",
    "/build-pc",
    "/danh-muc",
    "/khuyen-mai",
    "/bao-hanh",
    "/lien-he",
    "/blog",
  ];

  const categorySlugs = [
    "cpu",
    "gpu",
    "motherboard",
    "ram",
    "storage",
    "psu",
    "case",
    "cooling",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Routes across all locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/blog" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/blog" ? 0.9 : 0.8,
      });
    }

    // 2. Categories
    for (const cat of categorySlugs) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/danh-muc/${cat}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.85,
      });
    }
  }

  // 3. Dynamic Products
  try {
    const { products } = await catalogService.getProducts({ limit: 100 });
    for (const product of products) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/san-pham/${product.slug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: "daily",
          priority: 0.9,
        });
      }
    }
  } catch {
    // If database is offline during build, static routes remain valid
  }

  // 4. Dynamic Blog Posts
  try {
    const { blogService } = await import("@/modules/blog/service");
    const posts = await blogService.getPublishedPosts({ limit: 100 });
    for (const post of posts) {
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }
  } catch {
    // Fallback if blog service is offline during build
  }

  return sitemapEntries;
}
