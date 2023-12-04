import React, { useState } from 'react';
import { DAY_NAMES } from '@/types/constants';
import {  getDaysOfMonth} from '../../utils/GetDatePeriod';
import {outOfMonth, getButtonText, isSelectedDate } from '../../utils/DateOperations'; 
import { PopupModal } from '@/types/PopupModal';
// import { useTranslations } from 'next-intl';
import CalendarButton from '../atoms/CalendarButton';
import styles from '@/styles/Calendar.module.css'

type CalendarDaysProps = {
    currentDate: Date;
    hasEvent: (date : Date)=> boolean;
    setPopupModal?: (coord: PopupModal) => void;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    textSize?: string;
}

export const CalendarDays = ({ currentDate,selectedDate, setSelectedDate, setPopupModal, hasEvent, textSize }: CalendarDaysProps) => {
    // const tradText = useTranslations('CalendarDays');
    const tradText = ( a : any) => a;
    const [weeks, setWeeks] = useState<Date[]>();
    React.useEffect(() => {
        setWeeks(getDaysOfMonth(currentDate));
    }, [currentDate]);


    const handleSelect = (n: Date , e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(setPopupModal){
            const { right, top } = e.currentTarget.getBoundingClientRect();
            setPopupModal({
                x: right + 5,
                y: top ,
                isVisible:true,
                date: n
                })
        }
        setSelectedDate(n);
    };


    const getVariant = (n : Date) => {
        if(!outOfMonth(n, currentDate?.getMonth()) && isSelectedDate(n, selectedDate))
            return "filled";
        //has not event
        if(hasEvent && !hasEvent(n) || outOfMonth(n, currentDate?.getMonth()))
            return "text";
        return "outlined"
    }

    const getColor = (n : Date) => {
        if(outOfMonth(n, currentDate?.getMonth()))
        return  'gray';
        if(hasEvent && hasEvent(n))
            return 'green';
        return 'blue';
    }

    return (
        <>
        <div className={styles.calendar__days__grid}>
            {/* DAY NAMES */}
            {DAY_NAMES.map((title) => {
                return Boolean(title) && (
                    <CalendarButton 
                    key={title}
                     variant='text' 
                     color='blue-gray' 
                     onClick={() => { }}
                     className={'mt-2 font-semibold ' + textSize}>
                        {tradText(`${title}`)}
                    </CalendarButton>
                )
            }
            )}
            {/* DAYS */}
            {(weeks ?? []).map((n, i) => (
                <CalendarButton
                variant={getVariant(n)}
                color={getColor(n)}
                key={n.toDateString()}
                onClick={(e) => handleSelect(n, e)}
                className={'p-0 ' + textSize}>
                    {getButtonText(n, 'day', tradText)}
                </CalendarButton>
            ))}
        
        </div>
            </>
    );
};

