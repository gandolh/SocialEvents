import { Dialog } from "@/components/Shared/molecules/Dialog";
import ModalLayout from "./ModalLayout";
import React from "react";
import ThemeSwitcher from "../atoms/ThemeSwitcher";
const ModalSettings = ({ open, handleOpen, title }) => {
  
    return (
        <Dialog open={open} handler={handleOpen}>
            <ModalLayout handleOpen={handleOpen} title={title}>
                <div className='p-4'>
                    <ThemeSwitcher />
                </div>
            </ModalLayout>
        </Dialog>

    );
}

export default ModalSettings;