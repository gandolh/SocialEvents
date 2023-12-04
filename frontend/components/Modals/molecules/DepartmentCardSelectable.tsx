
import React from "react";
import { FaCheck } from "react-icons/fa";
import { Department } from "@/types/Department";
type UserCardProps = {
    dept: Department;
    onClick?: () => void;
    selectable?: boolean;
    selected?: boolean;
}
const DepartmentCardSelectable = ({ dept, onClick, selectable, selected}: UserCardProps) => {
    return (
        <>
            <div  
            onClick={onClick}
            className='relative flex justify-between items-center my-2 p-2 border border-black-aero-02 rounded-lg' >
                    <div className="flex flex-col justify-center h-full">
                        <span className='text-sm font-bold'>{dept?.name}</span>
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

export default DepartmentCardSelectable;