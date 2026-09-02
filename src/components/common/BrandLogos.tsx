import React from "react";

// =========================================================================
// Official Vector Brand Logos for PC Hardware Giants
// =========================================================================

export function AsusRogLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-sans select-none ${className}`}>
      {/* ROG Stylized Eye Emblem */}
      <svg viewBox="0 0 40 32" className="h-7 w-auto fill-[#E11D48]" xmlns="http://www.w3.org/2000/svg">
        <path d="M38.5 4.2C36.8 2.5 33.2 0 28.5 0c-8.2 0-14.8 5.6-18.4 12.3-1.6 3-2.6 6.5-2.6 10.2 0 3.2.7 6.1 2.1 8.8.4.8 1.4 1.1 2.2.7.7-.4 1-1.3.6-2-1.1-2.2-1.7-4.7-1.7-7.3 0-3.1.8-6 2.1-8.5C15.8 7.8 21.6 3.2 28.5 3.2c3.8 0 6.6 1.8 8.1 3.2.6.5 1.5.4 2-.2.5-.6.4-1.5-.1-2zM1.2 27.5C.4 25.8 0 23.9 0 22c0-4.6 1.7-8.9 4.6-12.2.6-.7 1.6-.7 2.2-.1.6.6.7 1.6.1 2.2C4.3 14.6 2.8 18.2 2.8 22c0 1.6.3 3.1.9 4.5.3.8-.1 1.7-.9 2-.2.1-.4.1-.6.1-.6 0-1.1-.4-1.3-.9l.3-.2zm37.6-16.3c-.6-.6-1.6-.6-2.2.1-4.2 4.7-6.8 10.8-6.8 17.5 0 1-.8 1.8-1.8 1.8H18c-.8 0-1.5-.7-1.5-1.5 0-.8.7-1.5 1.5-1.5h8.8c.8-6.8 3.5-13 7.8-18 .6-.7 1.6-.7 2.2-.1.6.6.7 1.6.1 2.2l.9-.5zm-14 11.2c-.8 0-1.5.7-1.5 1.5v4.9c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-4.9c0-.8-.7-1.5-1.5-1.5z" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-black tracking-widest text-[#0F172A]">ASUS</span>
        <span className="text-[8px] font-extrabold tracking-wider text-[#E11D48] uppercase">ROG GAMING</span>
      </div>
    </div>
  );
}

export function NvidiaGeForceLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* NVIDIA Claw / Eye Badge */}
      <div className="flex h-7 w-7 items-center justify-center rounded bg-[#76B900] text-black">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 5.5c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5c2.4 0 4.5-1.3 5.6-3.2-.8-.6-1.5-1.4-2-2.3-.9 1.4-2.1 2.3-3.6 2.3-2.4 0-4.3-1.9-4.3-4.3s1.9-4.3 4.3-4.3c1.6 0 3 .9 3.7 2.2.5-.8 1.1-1.5 1.9-2.1C12.8 6.6 10.8 5.5 8.5 5.5zm11.2 2.7c-1.3-1.8-3.2-3.1-5.4-3.7-.3.8-.4 1.7-.4 2.6 1.8.5 3.3 1.5 4.3 2.9.8-1 1.3-1.8 1.5-1.8zM8.5 9.8c-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2c.9 0 1.7-.6 2-1.4-.2-.5-.3-1-.3-1.6 0-.5.1-.9.3-1.4-.3-.8-1.1-1.4-2-1.4z" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-black tracking-tight text-[#0F172A]">NVIDIA</span>
        <span className="text-[8px] font-black tracking-widest text-[#76B900] uppercase">GEFORCE RTX</span>
      </div>
    </div>
  );
}

export function IntelCoreLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      <div className="flex items-center">
        <span className="text-xl font-black tracking-tighter text-[#0068B5]">intel</span>
        <span className="text-[10px] font-extrabold text-[#00C7FD] ml-0.5">.</span>
      </div>
      <div className="rounded bg-[#0068B5] px-1.5 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
        CORE
      </div>
    </div>
  );
}

export function AmdRyzenLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      {/* AMD Arrow Emblem */}
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#ED1C24]" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h11v11H0V0zm13 0h11v11H13V0zM0 13h11v11H0V13zm15.5 0H24v8.5h-8.5V13z" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-black tracking-wider text-[#0F172A]">AMD</span>
        <span className="text-[9px] font-black tracking-widest text-[#ED1C24] uppercase">RYZEN</span>
      </div>
    </div>
  );
}

export function MsiGamingLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* MSI Dragon Shield Badge */}
      <div className="flex h-7 w-6 items-center justify-center rounded-sm bg-[#E11D48] text-white">
        <span className="font-mono text-xs font-black italic">G</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-black italic tracking-wider text-[#0F172A]">msi</span>
        <span className="text-[7px] font-bold tracking-widest text-[#E11D48] uppercase">TRUE GAMING</span>
      </div>
    </div>
  );
}

export function GigabyteAorusLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      {/* Aorus Falcon Wing Icon */}
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#EA580C]" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.5 3L13 9.5 8 7 2 13.5l8 2 2 5.5 9.5-6.5L24 8l-1.5-5zm-5 7.5L12 14l-3-.8 3.5-3.8 5 1.1z" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[12px] font-black tracking-wider text-[#0F172A]">GIGABYTE</span>
        <span className="text-[8px] font-black tracking-widest text-[#EA580C] uppercase">AORUS</span>
      </div>
    </div>
  );
}

export function CorsairSailsLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Corsair 3-Sail Emblem */}
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-[#0F172A]" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm-1.5 5.5c2.8 1.5 5 4.2 5.8 7.5H11.5c.8-3.3 3-6 5.8-7.5zm-8 12c1.2-2.5 3.5-4.5 6.5-5.5v11c-3-1-5.3-3-6.5-5.5zm19 0c-1.2 2.5-3.5 4.5-6.5 5.5V14c3 1 5.3 3 6.5 5.5z" />
      </svg>
      <span className="text-[13px] font-black tracking-widest text-[#0F172A]">CORSAIR</span>
    </div>
  );
}

export function SamsungMemoryLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 select-none ${className}`}>
      <span className="text-sm font-black tracking-wider text-[#1428A0]">SAMSUNG</span>
      <span className="rounded bg-[#EFF6FF] px-1 py-0.2 text-[8px] font-bold text-[#1428A0] border border-[#BFDBFE]">
        NVMe
      </span>
    </div>
  );
}

export function LianLiOfficialLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      <div className="flex h-5 w-5 items-center justify-center rounded bg-[#0F172A] text-white text-[10px] font-black">
        LL
      </div>
      <span className="text-xs font-black tracking-widest text-[#0F172A]">LIAN LI</span>
    </div>
  );
}

export function NzxtOfficialLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 select-none ${className}`}>
      <span className="text-sm font-black tracking-widest text-[#7C3AED]">NZXT</span>
      <span className="text-[9px] font-extrabold text-[#64748B]">.</span>
    </div>
  );
}

export function KingstonFuryLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-white text-[9px] font-black">
        K
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[11px] font-black tracking-tight text-[#0F172A]">Kingston</span>
        <span className="text-[8px] font-black tracking-widest text-[#DC2626]">FURY</span>
      </div>
    </div>
  );
}

export function WdBlackLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 rounded bg-[#0F172A] px-2 py-1 text-white select-none ${className}`}>
      <span className="text-xs font-black tracking-tight">WD_</span>
      <span className="text-xs font-black text-[#EA580C]">BLACK</span>
    </div>
  );
}
