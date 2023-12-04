'use client';
import React, { useEffect } from 'react';
import { ColumnGroup } from '../atoms/ColumnGroup';
import { getMonths, getNearbyYears } from '../../utils/GetDatePeriod';
import styles from "@/styles/Calendar.module.css"
type CalendarYearsProps = {
    currentDate: Date;
}

export const CalendarYears = ({currentDate} : CalendarYearsProps) => {

    const numberOfYears = 12;
    const [years, setYears] = React.useState<Date[]>([]);
    const [months, setMonths] = React.useState<Date[]>([]);
    useEffect(() => {
        setYears(getNearbyYears(
            currentDate,
            numberOfYears
        ));
        setMonths(getMonths(new Date(currentDate) || new Date()));
    }, [currentDate]);

    return (
        <div className={styles.calendar__years__columns}>
            <ColumnGroup
                title="Months"
                fragment='month'
                dates={months}
            />
            <ColumnGroup
                title="Years"
                fragment='year'
                dates={years}
            />
        </div>
    );
};
