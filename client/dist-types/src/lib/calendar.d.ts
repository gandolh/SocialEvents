export interface DayCell {
    date: Date;
    inMonth: boolean;
    iso: string;
}
/** 6-week grid (42 cells) starting on Sunday for the month containing `ref`. */
export declare function monthGrid(ref: Date): DayCell[];
export declare function monthRange(ref: Date): {
    from: string;
    to: string;
};
export declare function dayRange(ref: Date): {
    from: string;
    to: string;
};
export declare function localIsoDate(iso: string): string;
export declare const MONTH_NAMES: string[];
export declare const WEEKDAYS: string[];
//# sourceMappingURL=calendar.d.ts.map