import type { ReactNode } from "react";
export declare function Card({ children, className, ...rest }: {
    children: ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLDivElement>): import("react").JSX.Element;
export declare function CategoryChip({ category }: {
    category: string;
}): import("react").JSX.Element;
export declare function Avatar({ name, size }: {
    name: string;
    size?: number;
}): import("react").JSX.Element;
export declare function Spinner(): import("react").JSX.Element;
export declare function StarRating({ value, count, onRate, readOnly, size, }: {
    value: number;
    count?: number;
    onRate?: (rating: number) => void;
    readOnly?: boolean;
    size?: number;
}): import("react").JSX.Element;
export declare function EmptyState({ message }: {
    message: string;
}): import("react").JSX.Element;
//# sourceMappingURL=misc.d.ts.map