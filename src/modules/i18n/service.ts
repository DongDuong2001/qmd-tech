import { Locale, Product } from "@/shared/types";

export class I18nService {
  getLocalizedProductName(product: Product, locale: Locale): string {
    return locale === "en" ? product.name_en || product.name_vi : product.name_vi;
  }

  getLocalizedProductDesc(product: Product, locale: Locale): string {
    return locale === "en" ? product.desc_en || product.desc_vi || "" : product.desc_vi || "";
  }

  formatCurrencyVnd(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  }

  formatCurrencyUsd(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  formatPrice(amountVnd: number, locale: Locale, amountUsd?: number): string {
    if (locale === "en" && amountUsd) {
      return this.formatCurrencyUsd(amountUsd);
    }
    return this.formatCurrencyVnd(amountVnd);
  }
}

export const i18nService = new I18nService();
