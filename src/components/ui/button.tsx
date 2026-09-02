import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#E11D48] text-white hover:bg-[#BE123C] active:bg-[#9F1239] shadow-xs",
        accent:
          "bg-[#EA580C] text-white hover:bg-[#C2410C] active:bg-[#9A3412] shadow-xs",
        gold:
          "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706] active:bg-[#B45309] shadow-xs",
        blue:
          "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] shadow-xs",
        secondary:
          "bg-[#FFFFFF] text-[#0F172A] hover:bg-[#F1F5F9] border border-[#CBD5E1] shadow-xs",
        outline:
          "border border-[#CBD5E1] bg-transparent text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#E11D48] hover:text-[#E11D48]",
        ghost:
          "bg-transparent text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]",
        danger:
          "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-xs",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base font-extrabold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
