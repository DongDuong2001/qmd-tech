import React from "react";
import Image from "next/image";

// =========================================================================
// 100% Authentic Corporate Brand Logos for Top PC Hardware Manufacturers
// Loaded directly from official SVG vector assets in /public/brands/
// =========================================================================

interface BrandLogoProps {
  className?: string;
}

export function AsusRogLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative h-7 w-9 shrink-0">
        <Image
          src="/brands/asus_rog.svg"
          alt="ASUS Republic of Gamers"
          fill
          sizes="36px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col leading-none text-left">
        <span className="text-[13px] font-black tracking-widest text-[#0F172A]">ASUS</span>
        <span className="text-[7.5px] font-black tracking-wider text-[#E11D48] uppercase">ROG GAMING</span>
      </div>
    </div>
  );
}

export function NvidiaGeForceLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative h-6 w-8 shrink-0">
        <Image
          src="/brands/nvidia.svg"
          alt="NVIDIA"
          fill
          sizes="32px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col leading-none text-left">
        <span className="text-[12px] font-black tracking-tight text-[#0F172A]">NVIDIA</span>
        <span className="text-[7.5px] font-black tracking-widest text-[#76B900] uppercase">GEFORCE RTX</span>
      </div>
    </div>
  );
}

export function IntelCoreLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      <div className="relative h-6 w-14 shrink-0">
        <Image
          src="/brands/intel.svg"
          alt="Intel"
          fill
          sizes="56px"
          className="object-contain"
        />
      </div>
      <span className="rounded bg-[#0071C5] px-1.5 py-0.5 text-[8.5px] font-black text-white uppercase tracking-wider">
        CORE
      </span>
    </div>
  );
}

export function AmdRyzenLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative h-6 w-14 shrink-0">
        <Image
          src="/brands/amd.svg"
          alt="AMD"
          fill
          sizes="56px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col leading-none text-left">
        <span className="text-[10px] font-black tracking-wider text-[#EA580C] uppercase">RYZEN</span>
        <span className="text-[7px] font-bold text-[#64748B]">PROCESSORS</span>
      </div>
    </div>
  );
}

export function MsiGamingLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative h-6 w-14 shrink-0">
        <Image
          src="/brands/msi.svg"
          alt="MSI"
          fill
          sizes="56px"
          className="object-contain"
        />
      </div>
      <span className="rounded bg-[#FF0000] px-1.5 py-0.5 text-[8px] font-black text-white uppercase tracking-wider">
        GAMING
      </span>
    </div>
  );
}

export function GigabyteAorusLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative h-6 w-20 shrink-0">
        <Image
          src="/brands/gigabyte.svg"
          alt="GIGABYTE"
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function CorsairSailsLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative h-6 w-7 shrink-0">
        <Image
          src="/brands/corsair.svg"
          alt="Corsair"
          fill
          sizes="28px"
          className="object-contain"
        />
      </div>
      <span className="text-[13px] font-black tracking-widest text-[#0F172A]">CORSAIR</span>
    </div>
  );
}

export function SamsungMemoryLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className="relative h-6 w-20 shrink-0">
        <Image
          src="/brands/samsung.svg"
          alt="Samsung"
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function KingstonFuryLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      <div className="relative h-6 w-16 shrink-0">
        <Image
          src="/brands/kingston.svg"
          alt="Kingston Technology"
          fill
          sizes="64px"
          className="object-contain"
        />
      </div>
      <span className="text-[9px] font-black tracking-wider text-[#DC2626] uppercase">FURY</span>
    </div>
  );
}

export function NzxtOfficialLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className="relative h-6 w-16 shrink-0">
        <Image
          src="/brands/nzxt.svg"
          alt="NZXT"
          fill
          sizes="64px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function LianLiOfficialLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className="relative h-6 w-20 shrink-0">
        <Image
          src="/brands/lianli.svg"
          alt="Lian Li"
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function WdBlackLogo({ className = "h-8 w-auto" }: BrandLogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className="relative h-6 w-20 shrink-0">
        <Image
          src="/brands/westerndigital.svg"
          alt="Western Digital"
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
