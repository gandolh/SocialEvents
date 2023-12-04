import { SHORT_MONTH_NAMES } from '@/types/constants';
import dayjs from 'dayjs';
let customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const getDate = (day: number, month: number, year: number): Date => {
    const dayString = day.toString().padStart(2, '0');
    const monthString = month.toString().padStart(2, '0');
    const yearString = year.toString().padStart(4, '0');
    const date = dayjs(`${dayString}-${monthString}-${yearString}`, "DD-MM-YYYY").toDate();
    return date;
}


const CreateDate = (date: Date, hour: number, minutes: number) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minutes);
}

const isSelectedDate = (n: Date, selectedDate: Date) => {
    return (n.getDate() === selectedDate.getDate()
        && n.getMonth() === selectedDate.getMonth()
        && n.getFullYear() === selectedDate.getFullYear());
}

const outOfMonth = (date: Date, month: number): boolean => {
    return (
        date.getMonth() !== month
    );
}

const getButtonText = (date: Date, fragment: "year" | "month" | "day", translation: any) => {
    if (fragment === "year")
        return date.getFullYear().toString();
    if (fragment === "month")
        return translation(SHORT_MONTH_NAMES[date.getMonth().toString()]);
    return date.getDate().toString();
}


export {
    getDate,
    isSelectedDate,
     outOfMonth,
    getButtonText,
    CreateDate,
};