const Chip = ({children}) => {
    return (
        <div
            className="relative grid items-center font-sans font-bold uppercase 
            whitespace-nowrap select-none bg-blue-500/20 text-blue-900 py-1.5
             px-3 text-xs rounded-lg" >
            <span >
                {children}  
            </span>
        </div>

    );
}

export default Chip;