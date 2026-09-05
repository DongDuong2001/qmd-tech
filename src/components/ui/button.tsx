import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "btn-wipe group relative inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "btn-wipe-primary bg-[#0063FD] text-white hover:text-white shadow-xs hover:shadow-md",
        accent:
          "btn-wipe-accent bg-[#0F172A] text-white hover:text-white shadow-xs hover:shadow-md",
        gold:
          "btn-wipe-gold bg-[#0284C7] text-white hover:text-white shadow-xs hover:shadow-md",
        blue:
          "btn-wipe-primary bg-[#0063FD] text-white hover:text-white shadow-xs hover:shadow-md",
        secondary:
          "btn-wipe-secondary bg-[#FFFFFF] text-[#0F172A] border border-[#CBD5E1] shadow-2xs hover:border-[#0063FD] hover:text-[#0063FD]",
        outline:
          "btn-wipe-outline border border-[#CBD5E1] bg-transparent text-[#0F172A] hover:border-[#0063FD] hover:text-white",
        ghost:
          "btn-wipe-ghost bg-transparent text-[#475569] hover:text-[#0F172A]",
        danger:
          "btn-wipe-danger bg-[#DC2626] text-white hover:text-white shadow-xs hover:shadow-md",
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
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 w-full inline-flex items-center justify-center gap-1.5 transition-transform duration-200 group-hover:scale-[0.98] group-active:scale-95">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
