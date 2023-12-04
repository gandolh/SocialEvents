'use client'
import React from "react";
import PopupNewEvent from "@/components/Calendar/organisms/PopupNewEvent";
import { useClickableContext } from "@/components/hooks/UseClickableContext";
import styles from "@/styles/Calendar.module.css";
const EventCreator = ({ hours}) => {
    const {clicked, event,setEvent} = useClickableContext();
  
    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {

        if (clicked && (e.target instanceof HTMLDivElement)) {
            const newEvent = {
                ...event,
                endTime: e.target.dataset.timeslot,
                width: e.target.getBoundingClientRect().width,
                height: e.target.getBoundingClientRect().bottom - event.y
            }
            setEvent(newEvent);
        }
    }

    return (
        <>
            <div className="h-12 w-full">
                {hours.map((hour) => {
                    return (
                        <div
                            key={hour}
                            onMouseMove={(e) => handleMouseMove(e)}
                            className={styles.event__creator__hours}>
                            <div data-timeslot={hour + ":00"}></div>
                            <div data-timeslot={hour + ":15"}></div>
                            <div data-timeslot={hour + ":30"}></div>
                            <div data-timeslot={hour + ":45"}></div>
                        </div>
                    )
                })}

                {event.visible && <PopupNewEvent event={event} />}
            </div>
        </>);
}

export default EventCreator;