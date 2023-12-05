import React from 'react';
import { defaultProps, styles } from '@/components/Shared/static/input/BaseInput';
import type { InputProps } from '@/components/Shared/static/input/BaseInput';
import { objectsToString } from '@/components/utils/ComponentsHelper';
import classnames from "classnames";
const Input = ({
  variant,
  color,
  size,
  label,
  error,
  success,
  className,
  placeholder,
  required,
  readOnly,
  onChange,
  onInput,
  value,
  type,
  name,
  onFocus,
  onBlur,
  disabled
}: InputProps) => {
  //defaults
  variant = variant ?? defaultProps.variant;
  size = size ?? defaultProps.size;
  color = color ?? defaultProps.color;
  label = label ?? defaultProps.label;
  className = className ?? defaultProps.className;
  //init
  const { base, variants } = styles;

  //styles
  const inputVariant = variants[variant ?? "standard"];
  const inputSize = inputVariant.sizes[size ?? "md"];
  const inputError = objectsToString(inputVariant.error.input);
  const inputSuccess = objectsToString(inputVariant.success.input);
  const inputColor = objectsToString(inputVariant.colors.input[color ?? "primary"]);
  const labelError = objectsToString(inputVariant.error.label);
  const labelSuccess = objectsToString(inputVariant.success.label);
  const labelColor = objectsToString(inputVariant.colors.label[color ?? "primary"]);
  const containerClasses = classnames(
    objectsToString(base.container),
    objectsToString(inputSize.container));

  const inputClasses = classnames(
    objectsToString(base.input),
    objectsToString(inputVariant.base.input),
    objectsToString(inputSize.input),
    { [inputColor]: !error && !success },
    { [inputError]: error },
    { [inputSuccess]: success },
    className,
  );
  const labelClasses = classnames(
    objectsToString(base.label),
    objectsToString(inputVariant.base.label),
    objectsToString(inputSize.label),
    { [labelColor]: !error && !success },
    { [labelError]: error },
    { [labelSuccess]: success },
  );
  const asteriskClasses = classnames(objectsToString(base.asterisk));

  return (
    <div className={containerClasses}>
      <input
        className={inputClasses}
        placeholder={placeholder || " "}
        readOnly={readOnly}
        onChange={onChange}
        onInput={onInput}
        value={value}
        type={type ?? 'text'}
        name={name}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
      />
      <label className={labelClasses}>
        {label} {required ? <span className={asteriskClasses}>*</span> : ""}
      </label>
    </div>
  );
};

export default Input;
