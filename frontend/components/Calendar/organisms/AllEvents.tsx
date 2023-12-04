'use client';

import AllEventsBody from "../molecules/AllEventsBody";
import FilterEvents from "../molecules/FilterEvents";
import SortEvents from "../molecules/SortEvents";
import React from "react";
import type { EventFilters } from "@/types/Event";
import { getDate } from "@/components/utils/DateOperations";
import styles from "@/styles/Calendar.module.css"
const AllEvents = () => {
    const sortings = ['by date', 'by host']
    const currentYear = new Date().getFullYear();
    const [sortingWay, setSortingWay] = React.useState<-1 | 1>(1); // 1 for asc, -1 for desc
    const [selectedSorting, setSelectedSorting] = React.useState<string>(sortings[0]);
    const [eventCategory, setEventCategory] = React.useState<string>("");
    const [dateStart, setDateStart] = React.useState<Date>(getDate(1,1,currentYear));
    const [dateEnd, setDateEnd] = React.useState<Date>(getDate(31,12, currentYear));
    const [filters, setFilters] = React.useState({
        eventCategory: eventCategory,
        dateStart: dateStart,
        dateEnd: dateEnd
    } as EventFilters)

    React.useEffect(() => {
        setFilters({
            eventCategory: eventCategory,
            dateStart: dateStart,
            dateEnd: dateEnd
        } as EventFilters)
    }, [eventCategory, dateStart, dateEnd]);

    return (
        <div className={styles.all__events__wrapper}>
            <div className={styles.all__events__inner__wrapper}>
                <SortEvents 
                    sortings={sortings} 
                    sortingWay={sortingWay} 
                    setSortingWay={setSortingWay}
                    selectedSorting={selectedSorting}
                    setSelectedSorting={setSelectedSorting}
                    />
                <AllEventsBody 
                filters={filters} 
                sortingWay={sortingWay} 
                selectedSorting={selectedSorting}/>
                <FilterEvents
                    eventCategory={eventCategory}
                    setEventCategory={setEventCategory}
                    dateStart={dateStart}
                    setDateStart={setDateStart}
                    dateEnd={dateEnd}
                    setDateEnd={setDateEnd}
                />
            </div>
        </div>
    );
}

export default AllEvents;