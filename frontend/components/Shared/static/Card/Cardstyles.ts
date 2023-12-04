import CardFilled from "./CardFilled";
import CardGradient from "./CardGradient";



const Cardstyles = {
  defaultProps: {
    variant: "filled",
    color: "white",
    shadow: true,
    className: "",
  },
  styles: {
    base: {
      initial: {
        position: "relative",
        display: "flex",
        flexDirection: "flex-col",
        backgroundClip: "bg-clip-border",
        borderRadius: "rounded-xl",
      },
      shadow: {
        boxShadow: "shadow-md",
      },
    },
    variants: {
      filled: CardFilled,
      gradient: CardGradient,
    },
  },
};

export default Cardstyles;