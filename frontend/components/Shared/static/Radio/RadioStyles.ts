export const RadioStyles = {
  defaultProps: {
    color: "blue",
    label: undefined,
    icon: undefined,
    ripple: true,
    className: "",
    disabled: false,
    containerProps: undefined,
    labelProps: undefined,
    iconProps: undefined,
  },
  styles: {
    base: {
      root: {
        display: "inline-flex",
        alignItems: "items-center",
      },
      container: {
        position: "relative",
        display: "flex",
        alignItems: "items-center",
        cursor: "cursor-pointer",
        p: "p-3",
        borderRadius: "rounded-full",
      },
      input: {
        peer: "peer",
        position: "relative",
        appearance: "appearance-none",
        width: "w-5",
        height: "h-5",
        borderWidth: "border",
        borderRadius: "rounded-full",
        borderColor: "border-blue-gray-200",
        cursor: "cursor-pointer",
        transition: "transition-all",
        before: {
          content: "before:content['']",
          display: "before:block",
          bg: "before:bg-blue-gray-500",
          width: "before:w-12",
          height: "before:h-12",
          borderRadius: "before:rounded-full",
          position: "before:absolute",
          top: "before:top-2/4",
          left: "before:left-2/4",
          transform: "before:-translate-y-2/4 before:-translate-x-2/4",
          opacity: "before:opacity-0 hover:before:opacity-10",
          transition: "before:transition-opacity",
        },
      },
      label: {
        fontWeight: "font-light",
        userSelect: "select-none",
        cursor: "cursor-pointer",
        mt: "mt-px",
      },
      disabled: {
        opacity: "opacity-50",
        pointerEvents: "pointer-events-none",
      },
    },
  },
};

export default RadioStyles;