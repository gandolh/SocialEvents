import Dropdown from "../atoms/Dropdown";
import {EventCategoriesLabels} from "@/components/Shared/static/Categories";
import React from "react";
type EventCategoryPickerProps = {
    eventCategory: string;
    setEventCategory: (value: string) => void;
    textColor?: string;
    includeAll?: boolean;
}

const EventCategoryPicker = ({eventCategory, setEventCategory, textColor ,includeAll} : EventCategoryPickerProps) => {

    return (  
        <Dropdown 
        textColor={textColor}
        handleOnChange={(value) => setEventCategory(value)}
        values={includeAll ? ["All", ...EventCategoriesLabels] :  EventCategoriesLabels} 
        selectedValue={eventCategory}
        defaultLabel="" />
);
}
 
export default EventCategoryPicker;