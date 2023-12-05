import Button from "@/components/Shared/atoms/Button";
import React from "react";
import Chip from "@/components/Shared/atoms/Chip";
import dynamic from 'next/dynamic';

const LazyModalSelectUsers = 
dynamic(() => import('../organisms/ModalSelectUsers'));

const UsersSelector = ({setAttendees}) => {
    const [openSelectUsers, setOpenSelectUsers] = React.useState(false);
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const handleOpenSelectUsers = () => {
        setOpenSelectUsers(!openSelectUsers);
    }

    const handleSelectUsers = (users) => {
        setSelectedUsers(users);
        setAttendees(users);
        setOpenSelectUsers(!openSelectUsers);
    }


    return (
    <>
        <div className="flex flex-col gap-2">
            <Button 
            className=""
            variant="filled"
            color="blue"
            size="sm"
            fullWidth
            onClick={handleOpenSelectUsers}>
                Add attendees
            </Button>
            <div className="bg-gray-300 text-black min-h-[128px] max-h-[256px] w-full rounded-lg overflow-auto">
                <div className="flex flex-wrap overflow-auto gap-2 p-2">
                    {selectedUsers.map((user) => (
                        <Chip key={"addEventModal" + (user as any).email}>{(user as any).email}</Chip>
                    ))}                   
                </div>
            </div>
            {openSelectUsers &&
                <LazyModalSelectUsers
                handleOpen={handleOpenSelectUsers}
                open={openSelectUsers}
                onSelected={handleSelectUsers}
                departmentsSelectable={true}
                />}
        </div>
    </>

    );
}

export default UsersSelector;