'use client'
import {
  Dialog,
  DialogHeader,
  DialogBody,
} from "@/components/Shared/molecules/Dialog";
import Button from "@/components/Shared/atoms/Button";
import React from "react";
import EventDate from "../molecules/EventDate";
import LocationPicker from "../molecules/LocationPicker";
import axios from "axios";
import { Event } from "@/types/Event";
// import { useTranslations } from "next-intl";
import EventCategoryPicker from "../molecules/EventCategoryPicker";
import { EventCategoriesLabels } from "@/components/Shared/static/Categories";
import Input from "@/components/Shared/atoms/Input";
import Textarea from "@/components/Shared/atoms/Textarea";
import { Formik } from "formik";
import UsersSelector from "../molecules/UsersSelector";
import { createEvent } from "@/components/utils/ApiCallers/EventsApiCalls";
import { addNotifications } from "@/components/utils/ApiCallers/NotificationsApiCalls";
import { SocialEventsUser } from "@/types/SocialEventsUser";

type Location = {
  formatted_address: string;
  coordinates: string[];
}

const ModalCreateEvent = ({ open, handleOpen, user }) => {
  const tradText =  (a) => a; //useTranslations('Map');
  const [location, setLocation] = React.useState<Location>({} as Location);
  const [date, setDate] = React.useState<Date>(new Date());
  const [attendees, setAttendees] = React.useState<SocialEventsUser[]>([]);
  const closeModal = () => {
    handleOpen();
  }


  const handleSubmit = (values, { setSubmitting }) => {
    const event = {
      name: values.name,
      host: values.host,
      date: date,
      description: values.description,
      attendees: attendees,
      location: [location?.formatted_address ?? "", ...location?.coordinates ?? ["", 0, 0]]
    } as Event;

    createEvent(event).then(() => {
      handleOpen();
      console.log(tradText('Created Event'));
    });
    addNotifications(event);
    setSubmitting(false);
  }


  return (
    <React.Fragment>

      <Dialog
        open={open}
        handler={() => { }}
        size="md"
      >
        <DialogHeader>{tradText('Create Event')}</DialogHeader>
        <DialogBody>
          <div className="space-y-3">

          <Formik
            initialValues={
              { 
                name: '',
                host: user.email,
                date: '',
                description: '',
                attendees: '',
                location: '',
                category: EventCategoriesLabels[0],
                 }
              }
            validate={values => {
                const errors = {} as Event;
                //no validations
                return errors;
            }}

            onSubmit={handleSubmit}
        >
            {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                values
            }) => (
          <form onSubmit={handleSubmit} className=" mb-2 flex flex-col gap-3 w-full h-full">
            <div className="flex flex-col gap-3 overflow-auto max-h-[70vh] pt-2">
              
            <Input
              name="name"
              variant="outlined"
              label={tradText('Event name')}
              onChange={handleChange}
              value={values.name}
            />
            <Input
              name="host"
              variant="outlined"
              label={tradText('Host name')}
              onChange={handleChange}
              value={values.host}
            />
            <EventDate date={date} setDate={setDate} />
            <EventCategoryPicker eventCategory={values.category} setEventCategory={handleChange} />
            <Textarea
              name="description"
              variant="outlined"
              label={tradText('Event desc')}
              size="md"
              onChange={handleChange}
              value={values.description}
            />
            <LocationPicker setLocation={setLocation} />
            <UsersSelector setAttendees={setAttendees}/>
            </div>
            <div className="w-full flex gap-2 justify-end">
              <Button variant="outlined" color="red" onClick={closeModal}>
                {tradText('Cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {tradText('Create Button')}
              </Button>
            </div>

            </form>
            )}
        </Formik>
            </div> 
        </DialogBody>
      </Dialog>


    </React.Fragment>);
}

export default ModalCreateEvent;