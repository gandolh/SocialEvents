'use client';
import styles from '@/styles/Calendar.module.css'
import { getAllEvents } from "@/components/utils/ApiCallers/EventsApiCalls";
import { groupEvents, filterEvents } from "@/components/utils/EventsOperations";
import { getTimeString,getDateStringFromNumbers } from "@/components/utils/DateFormat";
import Divider from "@/components/Shared/atoms/Divider";
import type { EventFilters } from "@/types/Event";
import React from "react";
import { Event } from "@/types/Event";
type AllEventsBodyProps = {
    filters: EventFilters;
    sortingWay: -1 | 1;
    selectedSorting: string;
};
const AllEventsBody = ({ filters, sortingWay, selectedSorting }: AllEventsBodyProps) => {
    const [ AllEvents, setAllEvents ] = React.useState<Event[]>([]);
    const [groupedEvents, setGroupedEvents] = React.useState<Record<string, Event[]>>({});
    const [filteredEvents, setFilteredEvents] = React.useState<Event[]>([]);
    
    
    React.useEffect(() => {
        getAllEvents().then((res) => {
            const newAllEvents = res.allEvents.map((event) =>{return {...event, date: new Date(event.date)}});
            setAllEvents(newAllEvents);
        });
    }, []);

    React.useEffect(() => {
        const newFilters = filterEvents(AllEvents, filters);
        setFilteredEvents(newFilters);
    }, [filters,AllEvents]);

    React.useEffect(() => {
        const newGroupedEvents = groupEvents(
            filteredEvents,
            selectedSorting == 'by date' ? groupByDate : groupByHost ,
              selectedSorting,sortingWay);
        setGroupedEvents(newGroupedEvents);
    }, [filteredEvents, sortingWay, selectedSorting]);
    

    const groupByDate = (event : Event) =>{
         const date = new Date(event.date);
         const year = date.getFullYear();
         const month = date.getMonth();
         const day = date.getDate();
         return getDateStringFromNumbers(day, month + 1, year);
    }

    const groupByHost = (event : Event) =>{
        return event.host;
    }


    return (<div className={styles.all__events__container}>
        {Object.entries(groupedEvents).map(([date, events]) => (
            <React.Fragment key={"AllEvents_" + date}>
                <h5 className={styles.all__events__group__title}>{date}</h5>
                {events.map((event) => (
                    <div
                        key={"AllEvents_" + event._id}
                        role="button"
                        className={styles.all__events__event}
                    >
                        <div className="w-[70px]">
                            {getTimeString(event.date)}
                        </div>
                        <div className="font-semibold">
                            {event.name}
                        </div>
                    </div>
                ))}
                <Divider bgColor="bg-white-aero-04" />
            </React.Fragment>
        ))}

    </div>);
}

export default AllEventsBody;