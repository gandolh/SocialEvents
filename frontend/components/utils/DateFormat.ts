const getDateStringFromNumbers = (day : number, month : number, year : number) => {
    const dayString = day.toString().padStart(2, '0');
    const monthString = month.toString().padStart(2, '0');
    const yearString = year.toString().padStart(4, '0');
    return `${dayString}/${monthString}/${yearString}`;
}

const getDateStringFromDate = (date: Date) => {
    const dayString = date.getDate().toString().padStart(2, '0');
    const monthString = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearString = date.getFullYear().toString().padStart(4, '0');
    return `${dayString}/${monthString}/${yearString}`;
}

const getFullDateTimeString = (date: Date) => {
    const dayString = date.getDate().toString().padStart(2, '0');
    const monthString = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearString = date.getFullYear().toString().padStart(4, '0');
    const hourString = date.getHours().toString().padStart(2, '0');
    const minuteString = date.getMinutes().toString().padStart(2, '0');
    return `${dayString}/${monthString}/${yearString} ${hourString}:${minuteString}`;
}

const getTimeString = (date: Date) => {
    const hourString = date.getHours().toString().padStart(2, '0');
    const minuteString = date.getMinutes().toString().padStart(2, '0');
    return `${hourString}:${minuteString}`;
}


const getFormattedDate = (selectedDate, translation: any) => {
    const date = new Date(selectedDate);
    const rawMonth = date.toLocaleString('RO-ro', { month: 'long' });
    const month = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
    return `${translation(month)} ${date.getFullYear()}`;
}


export {
    getFormattedDate,
    getDateStringFromNumbers,
    getDateStringFromDate,
    getFullDateTimeString,
    getTimeString
};