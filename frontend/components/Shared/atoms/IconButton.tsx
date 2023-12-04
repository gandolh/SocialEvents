import React from "react";
// utils
import classnames from "classnames";
import { twMerge } from "tailwind-merge";
import { objectsToString } from "@/components/utils/ComponentsHelper";
export interface IconButtonProps extends React.ComponentProps<"button"> {
  variant?: string;
  size?: string;
  color?: string;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

import iconButtonStyles from "../static/IconButton";

export const IconButton =
  ({ variant, size, color, className, children, fullWidth, ...rest }: IconButtonProps) => {

    let style = {};
    let classes = "";
    // 1. init
    const { defaultProps, styles } = iconButtonStyles;
    const { base, sizes } = styles;

    // 2. set default props
    variant = variant ?? defaultProps.variant;
    size = size ?? defaultProps.size;
    color = color ?? defaultProps.color;
    className = className ?? defaultProps.className;

    // 3. set ripple effect instance

    // 4. set styles
    const buttonBase = objectsToString(base);
    const buttonVariant = `button__${variant}__${color} `;
    const buttonSize = objectsToString(sizes[size]);
    classes = twMerge(classnames(buttonBase, buttonSize, buttonVariant), className);

    // 5. return
    return (
      <button
        {...rest}
        className={classes}
        type={rest.type || "button"}
      >
        <span
          className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
          style={style}>
          {children}
        </span>
      </button>
    );
  };

export default IconButton;