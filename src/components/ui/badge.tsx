import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./button";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-extrabold tracking-wide uppercase transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border border-[#E2E8F0] bg-[#F1F5F9] text-[#334155]",
        primary: "bg-[#E11D48] text-white",
        accent: "bg-[#EA580C] text-white",
        gold: "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]",
        blue: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]",
        success: "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]",
        warning: "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]",
        danger: "bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]",
        discount: "bg-[#E11D48] text-white font-black",
        gift: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] text-[10px]",
        outline: "text-[#0F172A] border border-[#CBD5E1] bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
