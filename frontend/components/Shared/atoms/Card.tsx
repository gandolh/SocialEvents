import { objectsToString } from "@/components/utils/ComponentsHelper";
import classnames from "classnames";
import { twMerge } from "tailwind-merge";
import Cardstyles from "../static/Card/Cardstyles";
type CardProps = {
    variant?: string;
    color?: string;
    shadow?: boolean;
    className?: string;
    children: React.ReactNode;
}


const Card = ({variant, color, shadow, className, children} : CardProps) => {

    //init 
    const { defaultProps, styles } = Cardstyles;
    const { base, variants } = styles;

    //defaults
      variant = variant ?? defaultProps.variant;
      color = color ?? defaultProps.color;
      shadow = shadow ?? defaultProps.shadow;
      className = className ?? defaultProps.className;

    //classes
    const cardRoot = objectsToString(base.initial);
    const cardVariant = objectsToString(variants[variant][color]);
    const classes = twMerge(
      classnames(cardRoot, cardVariant, { [objectsToString(base.shadow)]: shadow }),
      className,
    );
    return (
        <div className={classes}>
          {children}
        </div>
      );
}
 
export default Card;