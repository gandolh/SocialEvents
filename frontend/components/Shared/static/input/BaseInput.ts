import inputOutlined from "./Outlined/InputOutlined";
import inputStandard from "./Standard/InputStandard";
import inputStatic from "./Static/InputStatic";

type InputProps = {
    variant?: "outlined" | "standard" | "static";
    size?: "md" | "lg";
    color?: string;
    label?: string;
    error?: boolean;
    success?: boolean;
    className?: string;
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    value?: string | number;
    type?: string;
    name?: string;
    disabled?: boolean;
  }
  

const defaultProps = {
    variant: "outlined",
    size: "md",
    color: "blue",
    label: "",
    error: false,
    success: false,
    icon: undefined,
    labelProps: undefined,
    containerProps: undefined,
    shrink: false,
    className: "",
  } as InputProps;


  const styles = {
    base: {
      container: {
        position: "relative",
        width: "w-full",
        minWidth: "min-w-[200px]",
      },
      input: {
        peer: "peer",
        width: "w-full",
        height: "h-full",
        bg: "bg-transparent",
        color: "text-blue-gray-700",
        fontFamily: "font-sans",
        fontWeight: "font-normal",
        outline: "outline outline-0 focus:outline-0",
        disabled: "disabled:bg-blue-gray-50 disabled:border-0",
        transition: "transition-all",
      },
      label: {
        display: "flex",
        width: "w-full",
        height: "h-full",
        userSelect: "select-none",
        pointerEvents: "pointer-events-none",
        position: "absolute",
        left: "left-0",
        fontWeight: "font-normal",
        color: "peer-placeholder-shown:text-blue-gray-500",
        lineHeight: "leading-tight peer-focus:leading-tight",
        disabled:
          "peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500",
        transition: "transition-all",
      },
      asterisk: {
        display: "inline-block",
        color: "text-red-500",
        ml: "ml-0.5",
      },
    },
    variants: {
      outlined: inputOutlined,
      standard: inputStandard,
      static: inputStatic,
    },
};

export {defaultProps, styles}
export type {InputProps}