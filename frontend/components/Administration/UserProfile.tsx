
'use client'
import React from "react";
// import { useTranslations } from "next-intl";
import Input from "@/components/Shared/atoms/Input";
import Button from "../Shared/atoms/Button";
import { SocialEventsUser } from "@/types/SocialEventsUser";
import { UpdateUsername } from "@/components/utils/ApiCallers/ServerApiCallers";
import { useSession } from "next-auth/react";

const UserProfile = ({ handleUserEdit, user }) => {
    const {update : updateSession} = useSession();
    user = user ?? {} as SocialEventsUser;
    const [name, setName] = React.useState<string>(user.name ?? '');
    const { email, department } = user;
    const handleChangeProfile = async () => {
        await UpdateUsername(name, email);
        updateSession({
            user: {
                ...user,
                name
            } as SocialEventsUser
        });
    }


    const ChangePasswordTrans = (a)=>a; // useTranslations('ChangePassword');
    return (
        <React.Fragment>
            <div className="flex flex-col justify-between h-full ">
                <div className="flex flex-col gap-2">
                    <Input label={ChangePasswordTrans('Name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <Input label={ChangePasswordTrans('Email')} value={email} readOnly  disabled/>
                    <Input label={ChangePasswordTrans('Department')} value={department} readOnly disabled/>
                </div>
                <div className="flex justify-end gap-2">
                    <Button onClick={handleUserEdit} className="flex-grow" variant="outlined" >
                        {ChangePasswordTrans('Change')}
                    </Button>
                    <Button
                        className="flex-grow"
                        variant="filled"
                        color="green"
                        onClick={handleChangeProfile}
                    >
                        {ChangePasswordTrans('SubmitChanges')}
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
}

export default UserProfile;