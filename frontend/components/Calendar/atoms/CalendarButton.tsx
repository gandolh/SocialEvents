
type CalendarButtonProps = {
    variant: "filled" | "outlined" | "text";
    color: "white" | "blue-gray" | "gray" | "brown" | "deep-orange" | "orange" | "amber" | 
    "yellow" | "lime" | "light-green" | "green" | "teal" | "cyan" |
     "light-blue" | "blue" | "indigo" | "deep-purple" |
      "purple" | "pink" | "red";
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className: string;
    children: React.ReactNode;
}
const CalendarButton = ({ variant, color, onClick, className, children }: CalendarButtonProps) => {
    const computeClassnames = () => {
        return `button button__${variant}__${color} `;
    }
        return (
            <>
                <button
                onClick={onClick}
                    className={ computeClassnames() + className}
                >{children}
                </button>
            </>
        )
}
export default CalendarButton;