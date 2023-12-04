import { Dialog } from "@/components/Shared/molecules/Dialog";
import ModalLayout from "./ModalLayout";
import Button from "@/components/Shared/atoms/Button";
import React from "react";
const ModalAreYouSure = ({onConfirm,onCancel,open,handleOpen, title, msg}) => {
    return ( <>
    <Dialog open={open} handler={handleOpen}>
    <ModalLayout handleOpen={handleOpen} title={title}>
           <div className='p-4'>
            <h4 className="text-black-aero-08 text-2xl my-2">{msg}</h4>
            <div className="flex justify-end gap-2">
           <Button variant="outlined" color="blue" onClick={onCancel}> Cancel</Button>
           <Button variant="filled" color="red" onClick={onConfirm }> Confirm</Button>
            </div>
           </div>
    </ModalLayout>
</Dialog>
    </> );
}
 
export default ModalAreYouSure;