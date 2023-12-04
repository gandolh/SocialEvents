import { Event } from "@/types/Event";
import type { EventFilters } from "@/types/Event";
// sort events by date
export const sortEvents = (selectedSorting: string, sortingWay: -1 | 1, events: Event[]) => {
    return  events.sort((a, b) => {
        if (selectedSorting === 'by date') {
            return sortingWay * (a.date.getTime() - b.date.getTime());
        } else {
            return sortingWay * (a.host.localeCompare(b.host));
        }
    });
}


//group events by year month and day
export const groupEvents = (
    events: Event[], 
    keyFormatter : (event: Event) => string,
    selectedSorting: string = "by date",
     sortingWay: -1 | 1 = 1) 
: Record<string, Event[]> => {
    sortEvents(selectedSorting, sortingWay, events);
    const groupedEvents: { [key: string]: Event[] } = {};
    events.forEach((event) => {
        const key = keyFormatter(event);
        if (!(key in groupedEvents)) {
            groupedEvents[key] = [];
        }
        groupedEvents[key].push(event);
    });
    return groupedEvents;
}

export const filterEvents = (events: Event[], filter: EventFilters) : Event[] => {
    let newEvents = [...events];
    // filter by category
    if (filter.eventCategory) {
        newEvents = events.filter((event) => {
            return event.category === filter.eventCategory;
        });
    }

    // filter by date
    if (filter.dateStart) {
        newEvents = newEvents.filter((event) => {
            return new Date(event.date).getTime() >= filter.dateStart.getTime();
        });
    }

    if (filter.dateEnd) {
        newEvents = newEvents.filter((event) => {
            return new Date(event.date).getTime() <= filter.dateEnd.getTime();
        });
    }

    return newEvents;
}