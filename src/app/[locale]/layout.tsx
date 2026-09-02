import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QMD-Tech — Gaming PC & Linh Kiện Máy Tính Chuyên Nghiệp",
  description:
    "Hệ thống bán lẻ linh kiện PC Gaming chính hãng: CPU, VGA RTX 40 Series, Mainboard, RAM DDR5, SSD NVMe và công cụ Custom PC Builder thông minh.",
  keywords: [
    "QMD-Tech",
    "PC Gaming",
    "KCCShop",
    "GearVN",
    "RTX 4070 Ti Super",
    "Ryzen 7 7800X3D",
    "Build PC gaming",
    "Linh kiện máy tính",
  ],
  icons: {
    icon: [
      { url: "/qmdtech_logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/qmdtech_logo.png",
    apple: "/qmdtech_logo.png",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "vi" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${beVietnamPro.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased flex flex-col justify-between selection:bg-[#E11D48] selection:text-white">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
