import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./button";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border border-[#2A3040] bg-[#1B2030] text-[#F2F4F8]",
        primary: "bg-[#3B82F6] text-white",
        accent: "bg-[#7C3AED] text-white",
        success: "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30",
        warning: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30",
        danger: "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30",
        price: "bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40 font-mono",
        outline: "text-[#F2F4F8] border border-[#2A3040]",
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
