'use client'
import * as React from 'react';
import ColoredCheckbox from '../atoms/ColoredCheckbox';
import Label from '@/components/Shared/atoms/Label';
import { useState } from "react";
// import { useTranslations } from 'next-intl';
import { EventCategory,EventCategories} from '../static/Categories';

const CheckboxList = () => {

  const [eventCategories, setEventCategories] = useState<EventCategory[]>(EventCategories)
  const tradText = (a)=> a // useTranslations('EventTypes');

  const handleToggle = (itemName: string) => {
    const newChecked = [...eventCategories];
    const index = newChecked.findIndex((item) => item.itemName === itemName);
    newChecked[index].checked = !newChecked[index].checked;
    setEventCategories(newChecked);
  };


  return (<ul className="h-48 pb-3 overflow-y-auto text-sm" >
    {eventCategories.map((checkbox) => {
      return (
        <li key={checkbox.itemName}>
          <div className="flex items-center p-2 rounded hover:bg-gray-600">
            <ColoredCheckbox
              defaultChecked={checkbox.checked}
              itemName={checkbox.itemName}
              onToggle={handleToggle}
              Color={checkbox.Color} />
            <Label text={tradText(checkbox.itemName)} />
          </div>
        </li>
      );
    })}

  </ul>);
}

export default CheckboxList;