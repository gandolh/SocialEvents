type XIconProps = {
    variant?: 'outlined' | 'filled' | 'text';
}


const XIcon = ({variant}) => {
    variant = variant ?? 'outlined';
    if(variant === 'outlined')
        return ( 
            <span className='rounded-full w-4 h-4 flex items-center justify-center text-xs bg-red-400 text-white'>
            x
        </span>
        );
}
 
export default XIcon;