'use client'

import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
const EventDate = ({ date, setDate }) => {

  return (
    <div>
      <DateTimePicker onChange={setDate} value={date} className="w-full"/>
    </div>
  );
}

export default EventDate;