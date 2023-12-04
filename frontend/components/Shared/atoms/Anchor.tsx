type AnchorProps = {
    href: string;
    className?: string;
    children: React.ReactNode;
}


const Anchor = ({href, className, children} : AnchorProps) => {
    return ( 
    <a href={href} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{children}</a> );
}
 
export default Anchor;