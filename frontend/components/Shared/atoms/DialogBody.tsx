type DialogBodyProps = {
    children: React.ReactNode,
    divider?: boolean;
    className?: string;
}

const DialogBody = ({ children, divider, className} : DialogBodyProps) => {
    const dividerClasses = divider ?
        "border-t border-t-blue-gray-100 border-b border-b-blue-gray-100" : "";  
    className = className ?? "";
    return (<>
        <div
            className={"relative p-4 text-blue-gray-500 antialiased font-sans "
            + "text-base font-light leading-relaxed " + dividerClasses 
            + " " + className}>
            {children}
        </div>
    </>);
}

export default DialogBody;