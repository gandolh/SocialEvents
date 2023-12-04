'use client'
import CalendarNavBar from '@/components/Calendar/molecules/CalendarNavBar';
import styles from '@/styles/Calendar.module.css';
import React from "react";
type CalendarLayoutProps = {
  children?: React.ReactNode
  params?: any
}

const CalendarLayout = ({ children }: CalendarLayoutProps) => {

  return (
    <>
      <div className={styles.main__calendar} id="CalendarViewHolder">
 
        <CalendarNavBar  />
        {children}
      </div>
    </>
  );
}

export default CalendarLayout;