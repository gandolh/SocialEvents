'use client'
import { FULL_MONTH_NAMES } from "@/types/constants"
import { getDate } from "@/components/utils/DateOperations";
import Minicalendar from "@/components/Calendar/molecules/MiniCalendar";
import styles from "@/styles/Calendar.module.css";
import { DisplayedDateContext } from "@/components/Providers";
import React from "react";
const YearView = ({setPopupModal}) => {
    const {displayedDate, _} = React.useContext(DisplayedDateContext) as any;
    return (
    <div className={styles.year__view__container}>
        {
            FULL_MONTH_NAMES.map((month, index) => {
                return   (
                <Minicalendar
                    className="bg-white-aero-08"
                    navigationDisabled={true}
                    initialValue={getDate(1, index + 1, new Date(displayedDate).getFullYear())}
                    key={"yearview_minicalendar_" + month}
                    setPopupModal={setPopupModal}
                    bordered={true}
                    borderColorClassname="border-white-aero-08"
                    calendarSizes="text-xl text-sm h-7 my-1.5"
                />
            )})}

    </div>
    );
}

export default YearView;