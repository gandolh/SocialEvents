'use client'
import { CalendarDays } from './CalendarDays';
import { CalendarYears } from './CalendarYears';
import React from 'react';
import { PopupModal } from '@/types/PopupModal';
import Divider from '@/components/Shared/atoms/Divider';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { FULL_MONTH_NAMES } from '@/types/constants';
import { EventContext, SelectedDateContext } from '@/components/Providers';
// import { useTranslations } from 'next-intl';
type MiniCalendarProps = {
    initialValue: Date;
    navigationDisabled: boolean;
    bordered?: boolean;
    borderColorClassname?: string;
    className?: string;
    setPopupModal?: (coord: PopupModal) => void;
    calendarSizes?: string; //"MonthYearSize DaySize height padding"
}

const events = new Array(10).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(i + 1);
    return {
        date,
        title: 'Event ' + i,
        description: 'Description ' + i,
    };
});

const MiniCalendar = ({ initialValue, navigationDisabled, bordered, borderColorClassname, className, setPopupModal, calendarSizes }: MiniCalendarProps) => {
    const [isSelectingYear, setIsSelectingYear] = React.useState<boolean>(false)
    const [currentDate, setCurrentDate] = React.useState<Date>(initialValue)
    const [eventDates, setEventDates] = React.useState<Date[]>([]);
    const {events, _} : any = React.useContext(EventContext);
    const {selectedDate, setSelectedDate} = React.useContext(SelectedDateContext) as any;

    const tradText = (a: any) => a;

    React.useEffect(() => {
        setCurrentDate(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const filteredEvents = events
            .filter((el) => el.date.getFullYear() === currentDate.getFullYear() && el.date.getMonth() === currentDate.getMonth())
            .map((el) => el.date);
        setEventDates(filteredEvents);
    }, [events, currentDate]);

    const hasEvent = (date: Date) => {
        const found = eventDates.find((el) => {
            return el.getFullYear() == date.getFullYear() && el.getMonth() == date.getMonth() && el.getDate() == date.getDate();
        })
        return !!found;
    }

    const onChange = (dir: 'forward' | 'backward') => () => {
        const numberOfMonths = 12;
        const intDir = (dir === 'backward' ? -1 : 1);
        if (isSelectingYear) {
            const offset = intDir * numberOfMonths;
            setCurrentDate((prev) => {
                const prevDate = new Date(prev);
                const newDate = new Date(prevDate.getFullYear() + offset, prevDate.getMonth(), prevDate.getDay());
                return newDate;
            });
        } else {
            setCurrentDate((prev) => {
                const prevDate = new Date(prev);
                const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + intDir, prevDate.getDay());
                return newDate;
            }
            );
        }
    };



    const onYearChange = () => {
        //save date with current day, month, year to context
        setIsSelectingYear((x) => !x);
    };

    const getWrapperTheme = () => {
        let classname = '';
        
            classname = 'rounded-xl'
            if (bordered) {
                classname += ` border-solid border-2 ${borderColorClassname ?? ''} ${(className ?? '')}`;
            }
            return classname;
    }

    return (

        <div
            className={`flex flex-col mb-2 ${getWrapperTheme()}`}
            >
            {/* calendar header */}
            <div 
            className={'flex items-center title-bar ' + calendarSizes?.split(' ')[3] }>
                {!navigationDisabled && <FaCaretLeft onClick={onChange('backward')} />}

                <div
                    className={'flex flex-1 justify-center font-bold select-none cursor-pointer title-bar-text ' + calendarSizes?.split(' ')[0]}
                    onClick={navigationDisabled ? () => { } : onYearChange}
                >
                    {!isSelectingYear ? `${tradText(FULL_MONTH_NAMES[currentDate?.getMonth()])} ${currentDate?.getFullYear()}` : tradText('Back')}
                </div>
                {!navigationDisabled && <FaCaretRight onClick={onChange('forward')} />}
            </div>
            {bordered && <Divider bgColor={borderColorClassname?.replace('border', 'bg')} />}

            {/* calendar body */}
            {isSelectingYear
                ? <CalendarYears currentDate={currentDate} />
                :
                <CalendarDays
                    currentDate={currentDate}
                    setPopupModal={setPopupModal}
                    hasEvent={hasEvent}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    textSize={calendarSizes?.split(' ')[1] + ' ' + calendarSizes?.split(' ')[2]}
                />}
        </div>

    );
}

export default MiniCalendar;