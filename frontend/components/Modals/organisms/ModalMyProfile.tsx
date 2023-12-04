'use client'
import { Dialog } from '@/components/Shared/molecules/Dialog';
import ModalLayout from './ModalLayout';
import ChangePassword from '@/components/Administration/ChangePassword'; 
import UserProfile from '@/components/Administration/UserProfile';
import React from 'react';
import md5 from 'md5';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import HorizontalDivider from '../atoms/VerticalDivider';

const ModalMyProfile = ({ handleOpen, open }) => {
    const gravatarUrl = 'https://gravatar.com/avatar/';
    const [pfp, setPfp] = React.useState<string>(gravatarUrl);
    const { status, data: session } = useSession();

    React.useEffect(() => {
        if (status === "authenticated") {
            setPfp(gravatarUrl + md5(session?.user?.email) + "?s=320&d=mm");
        }
    }, [status, session]);

    const [isUserEdit, setIsUserEdit] = React.useState(true);
    const handleUserEdit = () => { setIsUserEdit(prev => !prev) };
    const handleCloseModal = () => { handleOpen(); }

    return (
        <Dialog size='md' className='rounded-lg' handler={handleOpen} open={open}>
            <ModalLayout handleOpen={handleOpen} title={'MyProfile'}>
                <div className="flex">
                    <div className="flex justify-center items-center grow">
                        <Image
                            className="rounded-full"
                            height={220}
                            width={220}
                            src={pfp}
                            alt="user icon"
                        />
                    </div>
                    <HorizontalDivider />
                    <div className='grow'>
                        {isUserEdit ?
                            <UserProfile handleUserEdit={handleUserEdit} user={session?.user} />
                            : <ChangePassword
                                handleUserEdit={handleUserEdit}
                                email={session?.user?.email}
                                handleCloseModal={handleCloseModal} />
                        }
                    </div>
                </div>
            </ModalLayout>
        </Dialog>

    );
}

export default ModalMyProfile;