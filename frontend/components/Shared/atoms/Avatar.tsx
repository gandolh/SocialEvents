import Image from "next/image";
import styles from '@/styles/Sidebar.module.css';
const Avatar = ({ src, alt, name } : {src?: string, alt?: string, name: string}) => {
    return (
    <div className="flex items-center gap-1 h-full p-3">
    <div className={styles.avatar__button +  " hover:bg-white-aero-02 hover:cursor-pointer"}>
    <Image className="w-10 h-10 rounded-full" src={src} alt={alt ?? "Avatar icon"} width={40} height={40}></Image>  
    <p className='text-slate-300'>{name}</p>
    </div>
    </div>)
}

export default Avatar;