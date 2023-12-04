
import React from "react"
import Sidebar from "@/components/Shared/organisms/Sidebar";
import CalendarLayout from "@/components/Calendar/organisms/CalendarLayout";
import dynamic from 'next/dynamic';
import styles from '@/styles/Calendar.module.css'

export default function RootLayout({children}: { children: React.ReactNode}) {

  const LazyCloudsBackground = 
    dynamic(() => import("@/components/Calendar/atoms/CloudsBackground"));
  return (
    <>
        <LazyCloudsBackground className={styles.layout__cloud__background}/>
              <div className={styles.layout__container}>
                <Sidebar />
                <CalendarLayout>
                  {children}
                </CalendarLayout>
              </div>
    </>
  );
}
