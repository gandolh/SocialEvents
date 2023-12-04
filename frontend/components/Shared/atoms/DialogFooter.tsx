const DialogFooter = ({ children }) => {
    return (<>
        <div className="flex items-center justify-end shrink-0 flex-wrap p-4 text-blue-gray-500">
            {children}
        </div>
    </>);
}

export default DialogFooter;