'use client'
import { useUsers } from "@/components/utils/ApiCallers/SwrApiCallers";
import ModalLayout from "./ModalLayout";
import { Dialog } from "@/components/Shared/molecules/Dialog";
import React from "react";
import Button from "@/components/Shared/atoms/Button";
import UserCardSelectable from "../molecules/UserCardSelectable";
import DepartmentsSelectList from "../molecules/DepartmentsSelectList";
import Input from "@/components/Shared/atoms/Input";

type ModalSelectUsersProps = {
    onSelected: (users: any[]) => void;
    open: boolean;
    handleOpen: () => void;
    departmentsSelectable?: boolean;
}

const ModalSelectUsers = ({ onSelected, open, handleOpen, departmentsSelectable }: ModalSelectUsersProps) => {
    const { allUsers } = useUsers();
    const [filteredUsers, setFilteredUsers] = React.useState([]);
    const [selectedUsers, setSelectedUsers] = React.useState([]);

    React.useEffect(() => {
        setFilteredUsers(allUsers);
    }, [allUsers]);
    

    const handleSelect = (user) => {
        if (selectedUsers.includes(user)) {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
        }
        else
            setSelectedUsers([...selectedUsers, user]);
    }
    const handleAddUsers = (users) => {
        users = users.filter((user) => !selectedUsers.includes(user));
        setSelectedUsers([...selectedUsers, ...users]);
    }

    const handleRemoveUsers = (users) => {
        setSelectedUsers(selectedUsers.filter((user) => !users.includes(user)));
    }

    const handleChangeFilteredUsers = (e) => {
        const value = e.target.value;
        if (value === '')
            setFilteredUsers(allUsers);
        else
            setFilteredUsers(allUsers.filter((user) => user?.name?.toLowerCase().includes(value.toLowerCase())));
    }

    return (<>
        <Dialog open={open} handler={handleOpen} size="xxl">
            <ModalLayout handleOpen={handleOpen} title='SelectUsers'>
                <div className="flex flex-col h-full">
                    <div className="flex-grow ">

                        {departmentsSelectable
                            &&
                            <DepartmentsSelectList
                                allUsers={allUsers}
                                addUsers={handleAddUsers}
                                removeUsers={handleRemoveUsers}
                            />}
                        <div className="flex justify-between mt-4 mb-1">
                            <h5 className="block antialiased tracking-normal font-sans text-xl
                            font-semibold leading-snug text-black-aero-07 mt-2">Users</h5>
                            <div className="w-[200px]">
                                <Input onInput={handleChangeFilteredUsers} label="Search for users" />
                            </div>
                        </div>
                        <div className="grid gap-x-4 "
                            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
                        >
                            {filteredUsers.map((user) => (
                                <UserCardSelectable
                                    onClick={() => handleSelect(user)}
                                    key={user.email}
                                    user={user}
                                    selectable={true}
                                    selected={selectedUsers.includes(user)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button className="w-[200px]" variant="filled" color="blue" onClick={() => onSelected(selectedUsers)}>Select</Button>
                    </div>
                </div>
            </ModalLayout>
        </Dialog>
    </>);
}
export default ModalSelectUsers;