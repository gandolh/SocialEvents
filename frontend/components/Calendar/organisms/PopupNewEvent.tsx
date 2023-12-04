import styles from "@/styles/Calendar.module.css"

const PopupNewEvent = ({ event }) => {
    return (
        <>
            <div id="popupNewEvent" className={styles.popup__new__event} style={{
                left: event?.x ?? 0,
                top: event?.y ?? 0,
                width: (event?.width ?? 0) - 10,
                height: event?.height ?? 0,
            }}>
                <p>(no title)</p>
                <p>{event?.startTime} - {event?.endTime}</p>
            </div>
        </>
    );
}

export default PopupNewEvent;