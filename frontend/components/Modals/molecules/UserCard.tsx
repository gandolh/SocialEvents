import XIcon from "@/components/Shared/atoms/XIcon";
import Image from "next/image";
import React from "react";
import md5 from 'md5';
import { SocialEventsUser } from "@/types/SocialEventsUser";
type UserCardProps = {
    removeUserFromDept?: (user) => void;
    user: SocialEventsUser;
}
const UserCard = ({ removeUserFromDept, user}: UserCardProps) => {
    const pfp = 'https://gravatar.com/avatar/' + md5(user?.email) + "?d=mm";
    return (
        <>
            <div  
            className='relative flex justify-between items-center my-2 p-2 border border-black-aero-02 rounded-lg' >
                <div className="flex flex-grow gap-[20px]">
                    <Image
                        className="rounded-full"
                        height={80}
                        width={80}
                        src={pfp}
                        alt="user icon"
                    />
                    <div className="flex flex-col justify-center">
                        <span className='text-sm font-bold'>{user?.name}</span>
                        <span className='text-xs'>{user?.email}</span>
                    </div>
                </div>
                {user.department !== "Guest" && removeUserFromDept  && <span
                    className='cursor-pointer absolute top-0 right-0 mt-2 mr-2'
                    onClick={() => removeUserFromDept(user)}>
                    <XIcon variant='outlined' />
                </span>}
            </div>
        </>
    );
}

export default UserCard;