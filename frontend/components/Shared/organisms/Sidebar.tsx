'use client'
import CheckboxList from "@/components/Shared/molecules/CheckboxList";
import AvatarMenu from "@/components/Shared/molecules/AvatarMenu";
import MiniCalendar from "@/components/Calendar/molecules/MiniCalendar";
import styles from '@/styles/Sidebar.module.css';
import React, { useContext } from 'react';
import { DisplayedDateContext } from "@/components/Providers";

const Sidebar = () => {
    const { displayedDate, _ } = useContext(DisplayedDateContext) as any;;
    return (
        <div className={ styles.sidebar + " "}>
            <AvatarMenu />
            <div className="flex flex-col justify-between px-3">
                <CheckboxList />
                <MiniCalendar navigationDisabled={false} initialValue={displayedDate} calendarSizes="text-2xl text-sm h-6"/>
            </div>
        </div>

    );
}

export default Sidebar;