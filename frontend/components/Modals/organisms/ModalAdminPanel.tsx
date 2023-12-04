'use client'
import { Dialog } from '@/components/Shared/molecules/Dialog';
import ModalLayout from './ModalLayout';
import { getUsersInDepartment, updateDepartment } from '@/components/utils/ApiCallers/UsersApiCalls';
import { UseDepartments, addDepartment, removeDepartment } from '@/components/utils/ApiCallers/DepartmentsApiCalls';
import DepartmentCard from '../molecules/DepartmentCard';
import UserCard from '../molecules/UserCard';
import React from 'react';
import VerticalDivider from '../atoms/VerticalDivider';
import Button from '@/components/Shared/atoms/Button';
import ModalCreateDept from './ModalCreateDept';
import ModalSelectUsers from './ModalSelectUsers';
import { SocialEventsUser } from '@/types/SocialEventsUser';
import Input from '@/components/Shared/atoms/Input';
import ModalAreYouSure from './ModalAreYouSure';
import { Department } from '@/types/Department';


const ModalAdminPanel = ({ handleOpen, open }) => {
    const { allDepts } = UseDepartments();
    const [depts, setDepts] = React.useState(allDepts);
    const [deptUsers, setDeptUsers] = React.useState([]);
    const [filteredDeptUsers, setFilteredDeptUsers] = React.useState([]);
    const [selectedDept, setSelectedDept] = React.useState("");
    const [openCreateDept, setOpenCreateDept] = React.useState(false);
    const [openSelectUsers, setOpenSelectUsers] = React.useState(false);
    const [openAreYouSure, setOpenAreYouSure] = React.useState(false);
    const [toBeRemovedDept, setToBeRemovedDept] = React.useState<Department>({} as Department);
    React.useEffect(() => {
        setDepts(allDepts);
    }, [allDepts]);


    React.useEffect(() => {
        fetchDeptUsers(selectedDept);
    }, [selectedDept]);

    React.useEffect(() => {
        setFilteredDeptUsers(deptUsers);
    }, [deptUsers]);

    const fetchDeptUsers = (deptName) => {
        getUsersInDepartment(deptName)
            .then((res) => { setDeptUsers(res.users); })
            .catch((err) => console.log(err));
    }

    React.useEffect(() => {
        setSelectedDept(depts[0]?.name ?? "");
        fetchDeptUsers(depts[0]?.name);
    }, [depts]);


    const open_remove_modal = async (dept) => {
        setToBeRemovedDept(dept);
        if (dept.name === "Guest")
            return;
        setOpenAreYouSure(true);
      
    }

    const confirmRemoveDept = async () => {
        
        const { error } = await removeDepartment(toBeRemovedDept.name);
        if (error) {
            console.log(error);
            return;
        }
        setDepts(depts.filter((d) => d._id !== toBeRemovedDept._id))
        handleOpenAreYouSure();
    }

    const removeUserFromDept = async (user) => {
        if (user.department === "Guest")
            return;
        const { error } = await updateDepartment(user.email, "Guest");
        if (!error)
            return;
        setDeptUsers(deptUsers.filter((u) => u._id !== user._id))
    }

    const handleCreateDepartment = async (deptName) => {
        const { error } = await addDepartment(deptName);
        if (error) {
            console.log(error);
            return;
        }
        setDepts([...depts, { name: deptName }])
        handleOpenCreateDept();
    }

    const handleOpenCreateDept = () => {
        setOpenCreateDept((prev) => !prev);
    }
    const handleOpenSelectUsers = () => {
        setOpenSelectUsers((prev) => !prev);
    }
    const handleOpenAreYouSure = () => {
        setOpenAreYouSure((prev) => !prev);
    }


    const addUsersToCurrentDept = async (users: SocialEventsUser[]) => {
        //add users with put request
        for (const user of users) {
            const { error } = await updateDepartment(user.email, selectedDept);
            if (error) {
                console.log(error);
                return;
            }
        }

        // refetch data
        fetchDeptUsers(selectedDept);
        handleOpenSelectUsers();

    }

    const handleChangeFilteredUsers = (e) => {
        const value = e.target.value;
        if (value === "")
            setFilteredDeptUsers(deptUsers);
        else {
            const filteredUsers = deptUsers.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));
            setFilteredDeptUsers(filteredUsers);
        }
    }

    return (
        <Dialog size='xl' className='rounded-lg' handler={handleOpen} open={open}>
            <ModalLayout handleOpen={handleOpen} title='Administration'>
                <div className='w-full h-[70vh] flex'>
                    <div className='w-3/12 h-full my-2 rounded-s-lg px-4 flex flex-col'>
                        <h3 className="text-black-aero-08 text-2xl font-bold my-2">Departments</h3>
                        <div className='overflow-auto flex-grow'>
                            {depts.map((dept) => (
                                <DepartmentCard
                                    key={dept._id}
                                    selected={selectedDept === dept.name}
                                    onClick={() => setSelectedDept(dept.name)}
                                    remove_dept={open_remove_modal}
                                    dept={dept}
                                />
                            ))}
                        </div>
                        <div className='flex justify-center items-center w-full'>
                            <Button
                                variant='filled'
                                fullWidth={true}
                                onClick={handleOpenCreateDept}
                            >Add new department</Button>
                        </div>
                    </div>
                    <VerticalDivider />
                    <div className='w-9/12 h-full my-2 rounded-s-lg px-4 flex flex-col gap-2'>
                        <div className="flex justify-between mt-4 mb-1">
                            <h3 className="text-black-aero-08 text-2xl font-bold my-2">Department Users</h3>
                            <div className="w-[200px]">
                                <Input onInput={handleChangeFilteredUsers} label="Search for users" />
                            </div>
                        </div>

                        <div className='overflow-auto flex-grow'>
                            {filteredDeptUsers.map((user) => (
                                <UserCard key={user._id} removeUserFromDept={removeUserFromDept} user={user} />
                            ))}
                        </div>

                        <div className='flex w-full items-center justify-end'>
                            <Button className='w-3/12' variant='filled' onClick={handleOpenSelectUsers}>Add Users</Button>
                        </div>
                    </div>
                </div>

            </ModalLayout>
            {openAreYouSure && <ModalAreYouSure
            title={'Are you sure?'}
            msg={'This action cannot be undone.'}
             onConfirm={confirmRemoveDept}
             onCancel={()=>setOpenAreYouSure(false)}
             open={openAreYouSure}
             handleOpen={handleOpenAreYouSure}
            />}
            {openCreateDept && <ModalCreateDept
                onCreateDepartment={handleCreateDepartment}
                open={openCreateDept}
                handleOpen={handleOpenCreateDept} />}
            {openSelectUsers && <ModalSelectUsers
                onSelected={(selectedUsers) => addUsersToCurrentDept(selectedUsers)}
                open={openSelectUsers}
                handleOpen={handleOpenSelectUsers}
            />}
        </Dialog>
    );
}

export default ModalAdminPanel;