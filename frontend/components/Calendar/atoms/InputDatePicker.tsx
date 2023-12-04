'use client'
import DatePickerBase from "@/components/Shared/atoms/DatePickerBaseProps";
import Input from "@/components/Shared/atoms/Input";
import React from "react";
import { getDateStringFromDate } from "@/components/utils/DateFormat";
type InputDatePickerProps = {
    date: Date;
    setDate: (date: Date) => void;
    label: string;
}


const InputDatePicker = ({date, setDate, label} : InputDatePickerProps) => {
    const [DateFocused, setDateFocused] = React.useState<boolean>(false);
    const datepickerWrapperRef = React.useRef(null);
    const onBlur = () => {
        setDateFocused(false);
    };

    const handleBlur = React.useCallback(
        (e) => {
            const currentTarget = e.currentTarget;

            // Give browser time to focus the next element
            requestAnimationFrame(() => {
                // Check if the new focused element is a child of the original container
                if (!currentTarget.contains(document.activeElement)) {
                    onBlur();
                }
            });
        },
        [onBlur]
    );

    const handleFocus= () =>{
        datepickerWrapperRef.current.focus();
        setDateFocused(true)
    }

    return (
        <>
            <Input
                className="w-full"
                color="white-aero-08"
                variant="static"
                label={label}
                onFocus={handleFocus}
                value={getDateStringFromDate(date)}
                readOnly={true}
            />
            <div
            tabIndex={0}
                className="relative"
                onBlur={handleBlur}
                ref={datepickerWrapperRef}
            >
                {DateFocused
                    && <DatePickerBase
                        datePickerDate={date}
                        setDatePickerDate={setDate}
                        OnChange={(date) => setDate(date)}
                        className="bg-white-aero-09" />}
            </div>
        </>
    );
}

export default InputDatePicker;