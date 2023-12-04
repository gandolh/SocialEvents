import { Dialog } from "@/components/Shared/molecules/Dialog";
import ModalLayout from "./ModalLayout";
import Input from "@/components/Shared/atoms/Input";
import Button from "@/components/Shared/atoms/Button";
import React from "react";
const ModalCreateDept = ({open, handleOpen, onCreateDepartment}) => {
    const [deptName, setDeptName] = React.useState("");

    return ( 
    <Dialog open={open} handler={handleOpen}>
    <ModalLayout handleOpen={handleOpen} title='CreateDepartment'>
           <div className='p-4 flex flex-col gap-2 items-end'>
           <Input value={deptName} onChange={(e) => setDeptName(e.target.value)} label='Enter department name' variant='static'/>
           <Button onClick={(e ) => onCreateDepartment(deptName)}> Add department</Button>
           </div>
    </ModalLayout>
</Dialog> );
}
 
export default ModalCreateDept;