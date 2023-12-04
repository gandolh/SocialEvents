import { Event } from "@/types/Event";
import { PopupModal } from "@/types/PopupModal";
import React from "react";
import { getTimeString } from "../../utils/DateFormat";
import ModalEvent from "./ModalEvent";

type PopupViewEventsProps = {
    popupModal: PopupModal,
}

const PopupViewEvents = ({ popupModal }: PopupViewEventsProps) => {
    const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
    const [open, setOpen] = React.useState<boolean>(false);
    const [filteredEvents, setFilteredEvents] = React.useState<Event[]>([]);
    const events : Event[]= [
        {
            _id: "1",
            name: "test",
            date: new Date(),
            description: "test",
            color: "red",
        },
        {
            _id: "2",
            name: "test",
            date: new Date(),
            description: "test",
            color: "red",
        },
        {
            _id: "3",
            name: "test",
            date: new Date(),
            description: "test",
            color: "red",
        }];

    React.useEffect(() => {
        const getPopupEvents = () => {
            if (!popupModal.date) return [];
            return events.filter((el) => {
                return (
                    el.date.getFullYear() == popupModal.date.getFullYear() &&
                    el.date.getMonth() == popupModal.date.getMonth() &&
                    el.date.getDate() == popupModal.date.getDate()
                );
            });
        }
        
        setFilteredEvents(getPopupEvents());
    }, [popupModal]);


    const handleOpen = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleOpenEvent = (event) => {
        setSelectedEvent(event);
        setOpen((prevOpen) => !prevOpen);
    };


    return (<>
        <div id="PopupViewEvent"
        onScroll={(e) => console.log('scrolling')}
        className={
            `bg-white-aero-09 w-60 absolute rounded-lg p-2 ${(popupModal.isVisible && filteredEvents.length > 0) ? "block" : "hidden"}`}
            style={{ left: popupModal.x, top: popupModal.y, minHeight: '4rem' }}>
            <div id="internal_PopupViewEvent" 
            className="flex flex-col overflow-auto max-h-28"
            style={{ minHeight: '4rem' }}
            >
                {filteredEvents.map((event) =>
                (
                    <div 
                    key={event._id}
                    className="grid grid-cols-[1fr_auto] py-1 px-2 rounded-md hover:bg-dark-aero-08 hover:text-white"
                    onClick={() => handleOpenEvent(event)}
                     >
                        <div className="truncate" >{event.name}</div>
                        <div>{getTimeString(event.date)}</div>
                    </div >
                )
                )}
            </div>
            <ModalEvent open={open} handleOpen={handleOpen} event={selectedEvent}/>
        </div>
    </>);
}

export default PopupViewEvents;