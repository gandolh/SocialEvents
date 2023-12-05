import { UseDepartments } from "@/components/utils/ApiCallers/SwrApiCallers";
import DepartmentCardSelectable from "./DepartmentCardSelectable";
import React from "react";
import { Department } from "@/types/Department";
const DepartmentsSelectList = ({allUsers, addUsers, removeUsers}) => {
    const { allDepts} = UseDepartments();
    const [selectedDepts, setSelectedDepts] = React.useState<Department[]>([]);
    const handleSelect = (dept : Department) => {
        if (selectedDepts.includes(dept)) {
            const new_depts = selectedDepts.filter((u) => u._id !== dept._id);
            setSelectedDepts(new_depts);
            handleRemoveUsers([dept]);
        }
        else{
            const new_depts = [...selectedDepts, dept];
            setSelectedDepts(new_depts);
            handleAddUsers(new_depts);
        }
    }
    const handleAddUsers = (new_depts) => {
        const deptNames = new_depts.map((dept) => dept.name);
        const users = allUsers.filter((user) => deptNames.includes(user.department));
        
        addUsers(users);
    }

    const handleRemoveUsers = (new_depts) => {
        const deptNames = new_depts.map((dept) => dept.name);
        const users = allUsers.filter((user) => deptNames.includes(user.department));
        removeUsers(users);
    }
    return (
        <>
            <h5 className="block antialiased tracking-normal font-sans text-xl
             font-semibold leading-snug text-black-aero-07 mt-2">Departments</h5>
            <div>
                <div className="grid gap-x-4 "
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
                >
                    {allDepts.map((dept) => (
                        <DepartmentCardSelectable
                            onClick={() => handleSelect(dept)}
                            key={dept._id}
                            dept={dept}
                            selectable={true}
                            selected={selectedDepts.includes(dept)}
                        />
                    ))}
                </div>
            </div>

        </>

    );
}

export default DepartmentsSelectList;