import { SocialEventsUser } from "./SocialEventsUser";

export type Event = {
    _id?: string,
    name: string,
    host: string,
    date: Date,
    description: string,
    attendees: SocialEventsUser[],
    location: string[],
    category: string,
};

export type EventFilters = {
    eventCategory: string;
    dateStart: Date;
    dateEnd: Date;
}