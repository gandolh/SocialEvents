'use client'
import InputDatePicker from "../atoms/InputDatePicker";
import EventCategoryPicker from "@/components/Modals/molecules/EventCategoryPicker";
import styles from "@/styles/Calendar.module.css"
type FilterEventsProps = {
    dateStart: Date;
    setDateStart: (date: Date) => void;
    dateEnd: Date;
    setDateEnd: (date: Date) => void;
    eventCategory: string;
    setEventCategory: (value: string) => void;
}

const FilterEvents = ({dateStart, setDateStart, dateEnd, setDateEnd, eventCategory, setEventCategory} : FilterEventsProps) => {

    return (
        <div className={styles.filter__container}>
            <h3 className={styles.filter__h3}>Filter</h3>
            <div className={styles.filter__body}>
               
                <InputDatePicker date={dateStart} setDate={setDateStart} label="Start date"/>
                <InputDatePicker date={dateEnd} setDate={setDateEnd} label="End date"/>
                <EventCategoryPicker 
                includeAll={true}
                textColor="white-aero-08"
                eventCategory={eventCategory}
                setEventCategory={setEventCategory}
                 />
            </div>


        </div>


    );
}

export default FilterEvents;