import React from "react";

// utils
import classnames from "classnames";
import { twMerge } from "tailwind-merge";
import { objectsToString } from "@/components/utils/ComponentsHelper";
import CheckboxStyles from "../static/Checkbox/CheckboxStyles"; 

type objectType = {
    [key: string]: any;
  };


export interface CheckboxProps extends React.ComponentProps<"input"> {
  color?: string;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  containerProps?: objectType;
}

export const Checkbox = (
    {
      color,
      label,
      className,
      disabled,
      containerProps,
      ...rest
    } : CheckboxProps
  ) => {
    // 1. init
    const { defaultProps,  styles } = CheckboxStyles;
    const { base, colors } = styles;

    // 2. set default props
    color = color ?? defaultProps.color;
    label = label ?? defaultProps.label;
    className = className ?? defaultProps.className;
    disabled = disabled ?? defaultProps.disabled;

    // 3. set styles
    const rootClasses = classnames(objectsToString(base.root), {
      [objectsToString(base.disabled)]: disabled,
    });
    const containerClasses = twMerge(
        classnames(objectsToString(base.container)),
        containerProps?.className,
      );
    const inputClasses = twMerge(
      classnames(
        objectsToString(base.input),
        objectsToString(colors[color]),
      ),
      className,
    );
    const labelClasses = twMerge(classnames(objectsToString(base.label)));
    const iconContainerClasses = twMerge(
      classnames(objectsToString(base.icon))
    );

    // 4. return
    return (
      <div className={rootClasses}>
        <label
          className={containerClasses}
          htmlFor={rest.id || "checkbox"}
        >
          <input
            {...rest}
            type="checkbox"
            disabled={disabled}
            className={inputClasses}
            id={rest.id || "checkbox"}
          />
          <span className={iconContainerClasses}>
           
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
          </span>
        </label>
        {label && (
          <label className={labelClasses} htmlFor={rest.id || "checkbox"}>
            {label}
          </label>
        )}
      </div>
    );
  };

export default Checkbox;