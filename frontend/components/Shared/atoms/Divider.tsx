type DividerProps = {
    orientation?: 'horizontal' | 'vertical';
    bgColor?: string;
}


const Divider = ({ orientation, bgColor }: DividerProps) => {
    if (orientation === 'vertical')
        return (
            <div
            className="inline-block h-full m-0 min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50"></div>
        )
    return (<hr
        className={`h-0.5 border-0 opacity-100 ${bgColor ?? 'bg-white'}`}
    />);
}

export default Divider;