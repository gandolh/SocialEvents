import React from "react";
import classnames from "classnames";
import { twMerge } from "tailwind-merge";
import { objectsToString } from "@/components/utils/ComponentsHelper";
import RadioStyles from "../static/Radio/RadioStyles";

export interface RadioProps extends React.ComponentProps<"input"> {
    label?: string;
    className?: string;
    disabled?: boolean;
    labelTailwindColor?: string;
}

export const Radio =
    (
        {
            label,
            className,
            disabled,
            labelTailwindColor,
            ...rest
        }: RadioProps
    ) => {
        // 1. init
        const { defaultProps, styles } = RadioStyles;
        const { base } = styles;

        // 2. set default props
        label = label ?? defaultProps.label;
        className = className ?? defaultProps.className;
        disabled = disabled ?? defaultProps.disabled;
        labelTailwindColor = labelTailwindColor ?? "text-white-aero-08"
        // 4. set styles
        const rootClasses = classnames(objectsToString(base.root), {
            [objectsToString(base.disabled)]: disabled,
        });
        const containerClasses = twMerge(
            classnames(objectsToString(base.container)),
        );
        const inputClasses = twMerge(
            classnames(
                objectsToString(base.input)
            ),
            className,
        );
        const labelClasses = twMerge(classnames(objectsToString(base.label), labelTailwindColor));

        return (
            <div className={rootClasses}>
                <label
                    className={containerClasses}
                    htmlFor={rest.id || "radio"}
                >
                    <input
                        checked={rest.checked}
                        {...rest}
                        type="radio"
                        disabled={disabled}
                        className={inputClasses}
                        id={rest.id || "radio"}
                    />
                    <span
                        className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4
           pointer-events-none opacity-0 peer-checked:opacity-100
            transition-opacity text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 16 16"
                            fill="currentColor">
                            <circle data-name="ellipse" cx="8" cy="8" r="8">
                            </circle>
                        </svg>
                    </span>
                </label>
                {label && (
                    <label className={labelClasses} htmlFor={rest.id || "radio"}>
                        {label}
                    </label>
                )}
            </div>
        );
    };


export default Radio;