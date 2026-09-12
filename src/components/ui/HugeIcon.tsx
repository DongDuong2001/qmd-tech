import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

export type { IconSvgElement };

export interface HugeIconProps extends Omit<React.ComponentPropsWithoutRef<typeof HugeiconsIcon>, "icon"> {
  icon: IconSvgElement;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
}

export const HugeIcon = React.forwardRef<SVGSVGElement, HugeIconProps>(
  ({ icon, size = 18, strokeWidth = 1.5, className = "", ...props }, ref) => {
    return (
      <HugeiconsIcon
        ref={ref}
        icon={icon}
        size={size}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }
);

HugeIcon.displayName = "HugeIcon";

export type HugeIconComponent = React.ForwardRefExoticComponent<
  Omit<HugeIconProps, "icon"> & React.RefAttributes<SVGSVGElement>
>;

export function createHugeIconComponent(icon: IconSvgElement): HugeIconComponent {
  const Component = React.forwardRef<SVGSVGElement, Omit<HugeIconProps, "icon">>(
    (props, ref) => <HugeIcon ref={ref} icon={icon} {...props} />
  );
  Component.displayName = "HugeIconWrapper";
  return Component;
}
