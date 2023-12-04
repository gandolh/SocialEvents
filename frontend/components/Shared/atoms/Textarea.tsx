import React from "react";
// utils
import classnames from "classnames";
import { objectsToString } from "@/components/utils/ComponentsHelper";
import TextareaStyles from "../static/TextArea";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  variant?: string;
  size?: string;
  color?: string;
  label?: React.ReactNode;
  error?: boolean;
  success?: boolean;
  className?: string;
  resize?: boolean;
}

export const Textarea = (
    {
      variant,
      color,
      size,
      label,
      error,
      success,
      className,
      resize,
      ...rest
    } : TextareaProps,
  ) => {
    // 1. init
    const { defaultProps, styles } = TextareaStyles;
    const { base, variants } = styles;

    // 2. set default props
    variant = variant ?? defaultProps.variant;
    size = size ?? defaultProps.size;
    color = color ?? defaultProps.color;
    label = label ?? defaultProps.label;
    className = className ?? defaultProps.className;
    resize = resize ?? defaultProps.resize;
    // 3. set styles
    const textareaVariant = variants[variant];
    const textareaError = objectsToString(textareaVariant.error.textarea);
    const textareaSuccess = objectsToString(textareaVariant.success.textarea);
    const textareaColor = objectsToString(
      textareaVariant.colors.textarea[color],
    );
    const labelError = objectsToString(textareaVariant.error.label);
    const labelSuccess = objectsToString(textareaVariant.success.label);
    const labelColor = objectsToString(
      textareaVariant.colors.label[color],
    );
    const containerClasses = classnames(objectsToString(base.container));
    const textareaClasses = classnames(
      objectsToString(base.textarea),
      resize === false ? "resize-none":"",
      objectsToString(textareaVariant.base.textarea),
      objectsToString(textareaVariant.sizes[size].textarea),
      { [textareaColor]: !error && !success },
      { [textareaError]: error },
      { [textareaSuccess]: success },
      className,
    );
    const labelClasses = classnames(
      objectsToString(base.label),
      objectsToString(textareaVariant.base.label),
      objectsToString(textareaVariant.sizes[ size].label),
      { [labelColor]: !error && !success },
      { [labelError]: error },
      { [labelSuccess]: success },
    );

    // 4. return
    return (
      <div  className={containerClasses}>
        <textarea {...rest} className={textareaClasses} placeholder={rest?.placeholder || " "} />
        <label className={labelClasses}>{label}</label>
      </div>
    );
    };



export default Textarea;