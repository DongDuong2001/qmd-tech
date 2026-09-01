import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-[#3B82F6] text-white hover:bg-[#2563EB] focus-visible:ring-[#3B82F6]",
        accent: "bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus-visible:ring-[#7C3AED]",
        secondary: "bg-[#1B2030] text-[#F2F4F8] hover:bg-[#2A3040] border border-[#2A3040]",
        outline: "border border-[#2A3040] bg-transparent text-[#F2F4F8] hover:bg-[#131722] hover:border-[#3B82F6]",
        ghost: "bg-transparent text-[#F2F4F8] hover:bg-[#131722]",
        danger: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
        warning: "bg-[#F59E0B] text-black hover:bg-[#D97706]",
        price: "bg-[#FACC15] text-black font-semibold hover:bg-[#EAB308]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base font-semibold",
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
