'use client'
import { Event } from "@/types/Event";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@/components/Shared/molecules/Dialog";
import Button from "@/components/Shared/atoms/Button";
import { getFullDateTimeString } from "../../utils/DateFormat";
import React from "react";
import ModalMap from "./ModalMap";
import Chip from "@/components/Shared/atoms/Chip";
import StarRating from "../atoms/StarRating";


type ModalEventProps = {
    open: boolean,
    handleOpen: () => void,
    event: Event
}



const ModalEvent = ({ open, handleOpen, event }: ModalEventProps) => {
    const [openLocationModal, setOpenLocationModal] = React.useState(false);

    const handleOpenLocationModal = () => {
        setOpenLocationModal((prev) => !prev);
    }
    if (!event)
        return;
    return (<>
        <Dialog open={open} handler={handleOpen}>
            <DialogHeader>
                <div className="flex justify-between w-full">
                    {event?.name}
                    <StarRating ratingId={event?._id}/>
                </div>
            </DialogHeader>
            <DialogBody divider className="overflow-auto max-h-[65vh]">
                <div className="grid grid-cols-[150px_1fr] gap-2">
                    <div>date:</div>
                    <div>{getFullDateTimeString(event?.date ?? new Date())}</div>
                    <div>host:</div>
                    <div className="flex w-full gap-2">
                        {event?.host}
                        <StarRating ratingId={event?.host}/>
                    </div>
                    <div>description</div>
                    <div>{event?.description}</div>
                    <div>category</div>
                    <div>{event?.category}</div>
                    <div>attendees:</div>
                    <div>
                        <div className="bg-gray-300 text-black min-h-[128px] max-h-[256px] w-full rounded-lg">
                            <div className="flex flex-wrap overflow-auto gap-2 p-2">
                                {event?.attendees.map((attendee) => (
                                    //@ts-ignore
                                    <Chip key={"ATTENDEE" + attendee.email}>{attendee.email}</Chip>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div>location</div>
                    <div className="flex flex-col gap-1">{event?.location[0]}
                        <Button onClick={handleOpenLocationModal} size="sm">Vezi locatia</Button></div>

                </div>
            </DialogBody>
            <DialogFooter>
                <div className="flex ">
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>Confirm</span>
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>

        {openLocationModal &&
            <ModalMap event={event} open={openLocationModal} handleOpen={handleOpenLocationModal} />}
    </>);
}

export default ModalEvent;