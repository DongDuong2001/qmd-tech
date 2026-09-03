import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./button";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-extrabold tracking-wide uppercase transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border border-[#E2E8F0] bg-[#F1F5F9] text-[#334155]",
        primary: "bg-[#0063FD] text-white",
        accent: "bg-[#0F172A] text-white",
        gold: "bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]",
        blue: "bg-[#EFF6FF] text-[#0063FD] border border-[#BFDBFE]",
        success: "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]",
        warning: "bg-[#FEF3C7] text-[#0284C7] border border-[#BAE6FD]",
        danger: "bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]",
        discount: "bg-[#0063FD] text-white font-black",
        gift: "bg-[#EFF6FF] text-[#0063FD] border border-[#BFDBFE] text-[10px]",
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
