

import dayjs from 'dayjs';



const getDaysOfWeek = (date: Date) => {
    const startOfWeek = dayjs(date).day(0).toDate();
    const days: Date[] = new Array(7);
    for (let i = 0; i < 7; i++) {
        const date = dayjs(startOfWeek).add(i, 'day').toDate();
        days[i] = date;
    }
    return days;
}
function getDaysOfMonth(input: Date): Date[] {
    const date = new Date(input);
    const numberOfWeeks = 6;
    let startOfMonth = dayjs(date).startOf("month").day(); //0 - sunday, 6 - saturday
    const dateStartOfMonth = dayjs(date).startOf('month').toDate(); // date of first day of month
    if (startOfMonth === 0)
        startOfMonth = 7;
    let start = -startOfMonth + 1; // 1 = monday
    const days: Date[] = new Array(numberOfWeeks * 7);
    for (let i = 0; i < numberOfWeeks * 7; i++) {
        const date = dayjs(dateStartOfMonth).add(start + i, 'day').toDate();
        days[i] = date;
    }
    return days;

}

function getMonths(date: Date) {
    const currentYear = date.getFullYear();
    const currentDate = date.getDate();
    return [...new Array(12)].map(
        (_, idx) => new Date(currentYear, idx, currentDate)
    );
}

function getNearbyYears(date: Date, numberOfYears: number): Date[] {
    date = new Date(date);
    const currentYear = date.getFullYear();
    const startValue = Math.floor(currentYear / numberOfYears) * numberOfYears;
    return [...new Array(numberOfYears)].map(
        (_, idx) => new Date(startValue + idx, date.getMonth(), date.getDate())
    );
}


export {
    getDaysOfMonth,
    getMonths,
    getNearbyYears,
    getDaysOfWeek
};