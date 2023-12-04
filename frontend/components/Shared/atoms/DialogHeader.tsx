
const DialogHeader = ({ children }) => {
    return (
        <>
            <div className={
                "flex items-center shrink-0 p-4 text-blue-gray-900 " + 
                "antialiased font-sans text-2xl font-semibold leading-snug"}>
                {children}
            </div>
        </>
    );
}

export default DialogHeader;