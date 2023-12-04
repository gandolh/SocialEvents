import XIcon from "@/components/Shared/atoms/XIcon";
import Image from "next/image";
import React from "react";
import md5 from 'md5';
import { SocialEventsUser } from "@/types/SocialEventsUser";
import { FaCheck } from "react-icons/fa";
type UserCardProps = {
    user: SocialEventsUser;
    onClick?: () => void;
    selectable?: boolean;
    selected?: boolean;
}
const UserCardSelectable = ({ user, onClick, selectable, selected}: UserCardProps) => {
    const pfp = 'https://gravatar.com/avatar/' + md5(user?.email) + "?d=mm";
    return (
        <>
            <div  
            onClick={onClick}
            className='relative flex justify-between items-center my-2 p-2 border border-black-aero-02 rounded-lg' >
                    <Image
                        className="rounded-full"
                        height={80}
                        width={80}
                        src={pfp}
                        alt="user icon"
                    />
                    <div className="flex flex-col justify-center h-full">
                        <span className='text-sm font-bold'>{user?.name}</span>
                        <span className='text-xs'>{user?.email}</span>
                    </div>
                {selectable && <div className="flex flex-col h-full justify-center ">
                    <div 
                    style={{width:'40px', height:'40px'}}
                    className={
                        `flex justify-center items-center rounded-full
                         ${selected ? "bg-green-600 text-white" : "text-gray-600 border-gray-600 border "}`}>
                        <FaCheck size={20} />    
                    </div>
                    
                    </div>}
            </div>
        </>
    );
}

export default UserCardSelectable;