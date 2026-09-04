"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Home, Wrench, Package } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        {/* ========================================================================= */}
        {/* VENDING MACHINE 404 ANIMATION (Themed with Electric Blue & Slate Dark)    */}
        {/* ========================================================================= */}
        <div className="flex justify-center">
          <div
            className="vend-404"
            role="img"
            aria-label="404 error animation: a vending machine with the requested page stuck in its coil"
          >
            <div className="vend-machine">
              <div className="vend-display">
                <span className="vend-display-code">404</span>
                <span className="vend-display-msg">STUCK</span>
              </div>
              <div className="vend-window">
                <div className="vend-slot">
                  <span className="vend-item">200</span>
                  <span className="vend-coil"></span>
                </div>
                <div className="vend-slot">
                  <span className="vend-item vend-item-stuck">404</span>
                  <span className="vend-coil vend-coil-spin"></span>
                </div>
                <div className="vend-slot">
                  <span className="vend-item">302</span>
                  <span className="vend-coil"></span>
                </div>
              </div>
              <div className="vend-tray"></div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] uppercase tracking-tight">
            Trang Bị Kẹt Hoặc Không Tồn Tại
          </h1>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Đường dẫn linh kiện hoặc trang bạn đang tìm kiếm bị kẹt trong máy chủ hoặc đã được chuyển sang địa chỉ mới.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <Link href="/">
            <Button variant="primary" size="md" className="w-full text-xs font-bold gap-1.5 shadow-xs">
              <Home className="h-4 w-4" />
              Trang Chủ
            </Button>
          </Link>
          <Link href="/danh-muc">
            <Button variant="secondary" size="md" className="w-full text-xs font-bold gap-1.5">
              <Package className="h-4 w-4 text-[#0063FD]" />
              Kho Linh Kiện
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0]">
          <Link href="/build-pc" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0063FD] hover:underline">
            <Wrench className="h-3.5 w-3.5" />
            Trải nghiệm công cụ Tự Build PC Gaming →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .vend-404 {
          --v-ink: #0f172a;
          --v-accent: #0063fd;
          --v-accent-text: #ffffff;
          --v-shell: #ffffff;
          display: grid;
          place-items: center;
          font-family: ui-monospace, "JetBrains Mono", "SF Mono", monospace;
        }

        .vend-machine {
          position: relative;
          width: 118px;
          height: 158px;
          padding: 10px 10px 28px;
          box-sizing: border-box;
          background: var(--v-shell);
          border: 3px solid var(--v-ink);
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 99, 253, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
          animation: vend-thump 5s ease-in-out infinite;
        }

        .vend-display {
          position: relative;
          height: 20px;
          margin-bottom: 8px;
          background: var(--v-ink);
          border-radius: 4px;
          overflow: hidden;
        }

        .vend-display span {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-indent: 0.2em;
          color: var(--v-accent-text);
          background: var(--v-accent);
        }

        .vend-display-code {
          animation: vend-flash-a 5s infinite;
        }
        .vend-display-msg {
          animation: vend-flash-b 5s infinite;
        }

        .vend-window {
          display: flex;
          justify-content: space-between;
          gap: 6px;
          height: 68px;
          padding: 6px 5px 4px;
          box-sizing: border-box;
          border: 2px solid var(--v-ink);
          border-radius: 6px;
          background: #f8fafc;
        }

        .vend-slot {
          position: relative;
          flex: 1;
          display: grid;
          place-items: end center;
        }

        .vend-item {
          width: 22px;
          height: 28px;
          margin-bottom: 9px;
          display: grid;
          place-items: center;
          font-size: 7.5px;
          font-weight: 800;
          color: var(--v-ink);
          background: var(--v-shell);
          border: 2px solid var(--v-ink);
          border-radius: 3px;
          box-sizing: border-box;
        }

        .vend-item-stuck {
          background: var(--v-accent);
          color: #ffffff;
          border-color: #0052d4;
          transform-origin: 50% 100%;
          animation: vend-wiggle 5s ease-in-out infinite;
        }

        .vend-coil {
          position: absolute;
          bottom: 0;
          width: 15px;
          height: 15px;
          box-sizing: border-box;
          border: 2px dashed var(--v-ink);
          border-radius: 50%;
          background: var(--v-shell);
        }

        .vend-coil-spin {
          animation: vend-spin 5s linear infinite;
        }

        .vend-tray {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 9px;
          height: 10px;
          background: var(--v-ink);
          border-radius: 3px;
        }

        @keyframes vend-spin {
          0%,
          12% {
            transform: rotate(0);
          }
          50%,
          100% {
            transform: rotate(1.5turn);
          }
        }

        @keyframes vend-wiggle {
          0%,
          8% {
            transform: rotate(0);
          }
          20% {
            transform: rotate(9deg);
          }
          32% {
            transform: rotate(5deg);
          }
          44% {
            transform: rotate(12deg);
          }
          54% {
            transform: rotate(-4deg);
          }
          60% {
            transform: rotate(10deg);
          }
          68% {
            transform: rotate(7deg);
          }
          82%,
          100% {
            transform: rotate(0);
          }
        }

        @keyframes vend-thump {
          0%,
          52%,
          64%,
          100% {
            transform: translateX(0) rotate(0);
          }
          54% {
            transform: translateX(-3px) rotate(-0.8deg);
          }
          56% {
            transform: translateX(3px) rotate(0.8deg);
          }
          58% {
            transform: translateX(-2px);
          }
          60% {
            transform: translateX(2px);
          }
          62% {
            transform: translateX(-1px);
          }
        }

        @keyframes vend-flash-a {
          0%,
          60%,
          96%,
          100% {
            opacity: 1;
          }
          64%,
          92% {
            opacity: 0;
          }
        }

        @keyframes vend-flash-b {
          0%,
          60%,
          96%,
          100% {
            opacity: 0;
          }
          64%,
          92% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vend-404 .vend-machine,
          .vend-404 .vend-machine * {
            animation: none;
          }
          .vend-404 .vend-item-stuck {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
}
