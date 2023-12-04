'use client'
import React from "react";
import type { PopupModal } from "@/types/PopupModal";
import PopupViewEvents from "@/components/Modals/organisms/PopupViewEvents";
import YearView from "@/components/Calendar/organisms/YearView";
import styles from '@/styles/Calendar.module.css'
const Page = () => {
    const [popupModal, setPopupModal] = React.useState<PopupModal>({ x: 0, y: 0, isVisible: false });
    return <>
        <div className={styles.yearview__container} >
            <div className={styles.yearview__wrapper}>
                <YearView setPopupModal={setPopupModal}/>
            </div>
        </div>
        <PopupViewEvents popupModal={popupModal}  />
    </>

}
export default Page

