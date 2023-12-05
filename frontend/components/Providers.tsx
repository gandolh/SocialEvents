'use client'
import { createContext, useState } from 'react';
import React from 'react';
import { ThemeProvider } from "next-themes";
import { Event } from '@/types/Event';
import { getAllEvents } from './utils/ApiCallers/ServerApiCallers';

type EventContextType = {
    events: Event[],
    setEvents: (events: Event[]) => void

}

type SelectedDateContextType = {
    selectedDate: Date,
    setSelectedDate: (date: Date) => void

}

type DisplayedDateContextType = {
    displayedDate: Date,
    setDisplayedDate: (date: Date) => void
}

const EventContext = createContext<EventContextType | null>(null);
const SelectedDateContext = createContext<SelectedDateContextType | null>(null);
const DisplayedDateContext = createContext<DisplayedDateContextType | null>(null);

const Providers = ({ children }: PageWithChildren) => {

    const initialValue = new Date();
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(initialValue);
    const [displayedDate, setDisplayedDate] = useState<Date>(initialValue);

    React.useEffect(() => {
        getAllEvents().then((res) => {
            const allEvents = res.allEvents.map((event) =>{return {...event, date: new Date(event.date)}});
             console.log(allEvents);
            setEvents(allEvents);
        });
    }, []);

    return (
        <ThemeProvider enableSystem={false}>
            <EventContext.Provider value={{ events, setEvents }}>
                <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
                    <DisplayedDateContext.Provider value={{ displayedDate, setDisplayedDate } as DisplayedDateContextType}>
                        {children}
                    </DisplayedDateContext.Provider>
                </SelectedDateContext.Provider>
            </EventContext.Provider>
        </ThemeProvider>

    );
}

export default Providers;
export { EventContext, SelectedDateContext, DisplayedDateContext };
export type { EventContextType, SelectedDateContextType, DisplayedDateContextType };