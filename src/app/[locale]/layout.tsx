import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PagePreloader } from "@/components/common/PagePreloader";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://qmdtech.vercel.app"),
  title: {
    default: "QMD-Tech — Gaming PC & Linh Kiện Máy Tính Chuyên Nghiệp",
    template: "%s | QMD-Tech Gaming & Workstation",
  },
  description:
    "Hệ thống phân phối linh kiện PC Gaming và máy tính đồ họa chính hãng: CPU Intel/Ryzen, Card RTX 40 Series, Mainboard, RAM DDR5, SSD NVMe và công cụ Custom PC Builder thông minh.",
  keywords: [
    "QMD-Tech",
    "PC Gaming",
    "Build PC",
    "RTX 4070 Ti Super",
    "Ryzen 7 7800X3D",
    "Linh kiện máy tính",
    "Mainboard B650",
    "RAM DDR5",
  ],
  authors: [{ name: "QMD-Tech", url: "https://qmdtech.vercel.app" }],
  creator: "QMD-Tech",
  publisher: "QMD-Tech",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://qmdtech.vercel.app",
    siteName: "QMD-Tech",
    title: "QMD-Tech — Gaming PC & Linh Kiện Máy Tính Chuyên Nghiệp",
    description:
      "Hệ thống phân phối linh kiện PC Gaming và máy tính đồ họa chính hãng, bảo hành 30 ngày đổi mới.",
    images: [
      {
        url: "/qmdtech_logo.png",
        width: 800,
        height: 800,
        alt: "QMD-Tech Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QMD-Tech — Gaming PC & Linh Kiện Máy Tính Chuyên Nghiệp",
    description:
      "Hệ thống phân phối linh kiện PC Gaming và máy tính đồ họa chính hãng.",
    images: ["/qmdtech_logo.png"],
  },
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
      <body className="min-h-screen max-w-full overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] antialiased flex flex-col justify-between selection:bg-[#0063FD] selection:text-white">
        <NextIntlClientProvider messages={messages}>
          <PagePreloader />
          <Header />
          <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
