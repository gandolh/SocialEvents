type XIconProps = {
    variant?: 'outlined' | 'filled' | 'text';
}


const XIcon = ({variant}) => {
    variant = variant ?? 'outlined';
    if(variant === 'outlined')
        return ( 
            <span className='text-white rounded-full w-4 h-4
            flex items-center justify-center border border-red-400 text-red-400 text-xs
            hover:bg-red-400 hover:text-white'>
            x
        </span>
        );
}
 
export default XIcon;