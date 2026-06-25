import type { ReactNode } from "react";
interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: "md" | "lg" | "xl";
}
export declare function Modal({ open, onClose, title, children, footer, size }: ModalProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=Modal.d.ts.map