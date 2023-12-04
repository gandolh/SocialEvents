import ButtonSizes from "../static/Button/ButtonSizes";
type ButtonProps = {
    variant?: "filled" | "outlined" | "text" | "gradient";
    color?: string;
    size?: "sm" | "md" | "lg";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    style?: React.CSSProperties;
    children: React.ReactNode;
    disabled?: boolean;
}
const Button = ({ variant, color, size, onClick, className = "", fullWidth = false, type, style,disabled, children}: ButtonProps) => {
    if(disabled){
        color = "gray";
        variant = "filled";
    }
    const computeClassnames = () => {
        let styleClassname = "";
        color = color ?? "blue";
        variant = variant ?? "filled";
      
        styleClassname = `button button__${variant}__${color} `;

        let sizeStyleObject;
        switch (size) {
            case "sm":
                sizeStyleObject = ButtonSizes.sm;
                break;
            case "md":
                sizeStyleObject = ButtonSizes.md;
                break;
            case "lg":
                sizeStyleObject = ButtonSizes.lg;
                break;
            default:
                sizeStyleObject = ButtonSizes.md;
                break;
        }
        return styleClassname
                + " " + Object.values(sizeStyleObject).join(" ");
    }
    return (
        <>
            <button
                onClick={onClick}
                className={computeClassnames() + (fullWidth ? " w-full " : " ") +  className}
                type={type ?? "button"}
                style={style}
                disabled={disabled}
            >{children}
            </button>
        </>
    )
}
export default Button;