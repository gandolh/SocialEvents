import { CheckboxColors } from "@/types/Checkbox";
type EventCategory = {
    itemName: string,
     Color?: CheckboxColors | string,
   checked: boolean,
   id?: number,
    };

    
const EventCategories = [ { id: 1, itemName: 'Game night', checked: true, Color: CheckboxColors['red'] },
{ id: 2, itemName: 'Holiday', checked: true, Color: CheckboxColors['yellow'] },
{ id: 3, itemName: 'Team building', checked: true, Color: CheckboxColors['blue'] },
{ id: 4, itemName: 'Other', checked: true, Color: CheckboxColors['brown'] },
]
const EventCategoriesLabels = EventCategories.map((category) => category.itemName);


export  {EventCategories, EventCategoriesLabels};
export type {EventCategory}
