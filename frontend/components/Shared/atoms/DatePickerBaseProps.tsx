'use client'
import { CalendarDays } from "@/components/Calendar/molecules/CalendarDays";
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import React from "react";
import { FULL_MONTH_NAMES } from '@/types/constants';
// import { useTranslations } from 'next-intl';
import { CalendarYears } from "@/components/Calendar/molecules/CalendarYears";
import { getDate } from "@/components/utils/DateOperations";

type DatePickerBaseProps = {
    datePickerDate: Date;
    setDatePickerDate: React.Dispatch<React.SetStateAction<Date>>;
    className?: string;
    OnChange?: (date: Date) => void;
    onClick?: () => void;
}

const DatePickerBase = ({ datePickerDate, setDatePickerDate, OnChange, onClick, className }: DatePickerBaseProps) => {
    const [isSelectingYear, setIsSelectingYear] = React.useState<boolean>(false)
    const onYearChange = () => {
        setIsSelectingYear((x) => !x);
    };

    React.useEffect(() => {
        OnChange(datePickerDate)
    }, [datePickerDate]);

    const onDateChange = (dir: 'forward' | 'backward') => () => {
        const numberOfMonths = 12;
        const intDir = (dir === 'backward' ? -1 : 1);
        if (isSelectingYear) {
            const offset = intDir * numberOfMonths;
            setDatePickerDate((prev) => {
                const prevDate = new Date(prev);
                const newDate = getDate(prevDate.getDate(), prevDate.getMonth(), prevDate.getFullYear() + offset);
                return newDate;
            });
        } else {
            setDatePickerDate((prev) => {
                const prevDate = new Date(prev);
                const newMonth = prevDate.getMonth() + 1 + intDir;
                const newYear = newMonth > 0 ? prevDate.getFullYear() : prevDate.getFullYear() - 1;
                const newDate = getDate(prevDate.getDate(), newMonth > 0 ? newMonth : 12, newYear);
                return newDate;
            }
            );
        }
    };
    const tradText = (a)=>a // useTranslations('CalendarMonthsFull');
    return (
        <div
            onClick={onClick}
            className={"absolute z-10 flex flex-col p-2 mb-2 rounded-xl w-[240px] -translate-x-1/2 "
                + className}>
            {/* calendar header */}
            <div className='flex my-2 items-center'>
                <FaCaretLeft onClick={onDateChange('backward')} />

                <div
                    className='flex flex-1 justify-center font-bold text-lg select-none cursor-pointer'
                    onClick={onYearChange}
                >
                    {!isSelectingYear ? `${tradText(FULL_MONTH_NAMES[datePickerDate?.getMonth()])} ${datePickerDate?.getFullYear()}` : tradText('Back')}
                </div>
                <FaCaretRight onClick={onDateChange('forward')} />
            </div>
            {/* calendar body */}
            {isSelectingYear
                ? <CalendarYears currentDate={datePickerDate} />
                : <CalendarDays
                    currentDate={datePickerDate}
                    setPopupModal={() => { }}
                    hasEvent={() => false}
                    selectedDate={datePickerDate}
                    setSelectedDate={setDatePickerDate} />}
        </div>
    );
}

export default DatePickerBase;