import React from "react";
import TypographyColors from "../static/Typography/TypographyColors"
import TypographyVariants from "../static/Typography/TypographyVariants";
type TypographyProps = {
    variant?: "small" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "lead" | "paragraph";
    color?: string;
    className?: string;
    children: React.ReactNode;
}
  // 2. set template
  let template;
const Typography = ({variant, color, className, children, ...rest} : TypographyProps) => {
    const MapVariantToElement = {
        "small": "p",
        "lead": "p",
        "paragraph": "p",
        "h1": "h1",
        "h2": "h2",
        "h3": "h3",
        "h4": "h4",
        "h5": "h5",
        "h6": "h6"
    }

    const defaultColor = "black";
    const defaultVariant = "paragraph";
    const getClases = () => {   
        let colorsObject = TypographyColors[color ?? defaultColor];
        let variantObject = TypographyVariants[variant ?? defaultVariant];
        return Object.values(colorsObject).join(" ") + " " + Object.values(variantObject).join(" ");
    }
    let classes = className + " " + getClases(); 
    template = React.createElement(
        MapVariantToElement[variant ?? ""] ?? "p",
        {
            ...rest,
            className: classes,
        },
        children,
        );
      // 3. return
    return template;
}
 
export default Typography; 