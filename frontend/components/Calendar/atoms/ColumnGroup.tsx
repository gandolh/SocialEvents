'use client';
import React from 'react';
import Button from '@/components/Shared/atoms/Button';
import { getButtonText  }  from '../../utils/DateOperations';
// import { useTranslations } from 'next-intl';
import styles from '@/styles/Calendar.module.css'

interface ColumnGroupProps {
    dates: Date[];
    title: string;
    fragment: "year" | "month";
}

export const ColumnGroup = ({
    dates,
    title,
    fragment
} : ColumnGroupProps) => {
    const handleSelect = (date: Date) => () => {};
   
    // const translation = useTranslations('CalendarMonthsSmall');
    const translation = (a : any) => {};
    return (
            <div className={styles.column__group} >
                {Boolean(title) && (
                    <div className={styles.column__group__title}>
                        {/* {translation(title)} */}
                        title
                    </div>
                )}
                {dates.map((n) => (
                    <Button
                        key={n.toDateString()}
                        onClick={handleSelect(n)}
                    >
                        {getButtonText(n, fragment, translation)}
                    </Button>
                ))}
            </div>
    );
};
