import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
interface FieldProps {
    label?: string;
    error?: string;
}
export declare function Input({ label, error, className, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>): import("react").JSX.Element;
export declare function Textarea({ label, error, className, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>): import("react").JSX.Element;
export declare function Select({ label, error, className, children, ...rest }: FieldProps & React.SelectHTMLAttributes<HTMLSelectElement>): import("react").JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map