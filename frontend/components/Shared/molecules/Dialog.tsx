import React from "react";
// @floating-ui
import {
    useFloating,
    useInteractions,
    useClick,
    useRole,
    useDismiss,
    useId,
    FloatingPortal,
    FloatingOverlay,
    FloatingFocusManager,
} from "@floating-ui/react";
import DialogStyles from "../static/Dialog/DialogStyles";
import { twMerge } from "tailwind-merge";
import classnames from "classnames";
// framer-motion
import { AnimatePresence, motion } from "framer-motion";
import type { AnimatePresenceProps } from "framer-motion";
interface NewAnimatePresenceProps extends Omit<AnimatePresenceProps, "children"> {
    children: React.ReactNode;
}

export interface DialogProps extends React.ComponentProps<"div"> {
    open: boolean;
    handler: () => void;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    className?: string;
    children: React.ReactNode;
}

const Dialog = ({ open, handler, size, className, children, ...rest }: DialogProps) => {
    // 2. set default props
    handler = handler ?? undefined;
    size = size ?? "md";
    // 3. set styles
    const { base, sizes } = DialogStyles;

    const backdropClasses = classnames(objectsToString(base.backdrop));
    const dialogClasses = twMerge(
      classnames(
        objectsToString(base.container),
        objectsToString(sizes[size]),
      ),
      className,
    );
    

    // 4. set animation
    const animation = {
        unmount: {
            opacity: 0,
            y: -50,
            transition: {
                duration: 0.3,
            },
        },
        mount: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
        },
    };
    const backdropAnimation = {
        unmount: {
            opacity: 0,
            transition: {
                delay: 0.2,
            },
        },
        mount: {
            opacity: 1,
        },
    };
    // 5. set @floating-ui
    const { context } = useFloating({
        open,
        onOpenChange: handler,
    });

    const id = useId();
    const labelId = `${id}-label`;
    const descriptionId = `${id}-description`;

    const { getFloatingProps } = useInteractions([
        useClick(context),
        useRole(context),
        useDismiss(context),
    ]);

    // 6. Create an instance of AnimatePresence because of the types issue with the children
    const NewAnimatePresence: React.FC<NewAnimatePresenceProps> = AnimatePresence;

    // 7. return
    return (
        <FloatingPortal>
            <NewAnimatePresence>
                {open && (
                    <FloatingOverlay
                        style={{
                            zIndex: 9999,
                        }}
                        lockScroll
                    >
                        <FloatingFocusManager context={context}>
                            <motion.div
                                className={size === "xxl" ? "" : backdropClasses}
                                initial="unmount"
                                exit="unmount"
                                animate={open ? "mount" : "unmount"}
                                variants={backdropAnimation}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    {...getFloatingProps({
                                        ...rest,
                                        className: dialogClasses,
                                        "aria-labelledby": labelId,
                                        "aria-describedby": descriptionId,
                                    })}
                                    initial="unmount"
                                    exit="unmount"
                                    animate={open ? "mount" : "unmount"}
                                    variants={animation}
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </FloatingFocusManager>
                    </FloatingOverlay>
                )}
            </NewAnimatePresence>
        </FloatingPortal>
    );
}



import DialogHeader from "../atoms/DialogHeader";
import DialogBody from "../atoms/DialogBody";
import DialogFooter from "../atoms/DialogFooter";
import { objectsToString } from "@/components/utils/ComponentsHelper";
export { Dialog, DialogBody, DialogFooter, DialogHeader }