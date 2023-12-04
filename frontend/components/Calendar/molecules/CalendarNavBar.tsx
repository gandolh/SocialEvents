'use client'
import Paragraph from '@/components/Shared/atoms/Paragraph';
import IconButton from '@/components/Shared/atoms/IconButton';
import Button from '@/components/Shared/atoms/Button';
import { getFormattedDate } from "../../utils/DateFormat";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CalendarShowTypes } from '@/types/constants';
import React from 'react';
import styles from '@/styles/Calendar.module.css';
import { useRouter } from 'next/navigation';
// import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import Notifications from '@/components/Shared/molecules/Notifications';

const DynamicModalCreateEvent = dynamic(() => import('../../Modals/organisms/ModalCreateEvent'), {
    loading: () => <React.Fragment></React.Fragment>,
    });


const CalendarNavBar = () => {
    // const tradText = useTranslations('Misc');
    // const tradMonthsText = useTranslations('CalendarMonthsFull');
    const tradText = (a: any) => a;
    const tradMonthsText = (a: any) => a;
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const {data : session } = useSession();
    const handleOpen = () => setOpen(!open);
    const displayedDate = new Date();

    const handleClickToday = () => {
        // setDisplayedDate(new Date())
    }

    const handleChangeShowType = (href: string) => {
        router.push(href);
    }

    const handleTimeChange = (dir: "forward" | "backward") => {
        const pathname = window.location.pathname.split("/");
        const showType = pathname[pathname.length - 1];
        let step = -1;
        if (dir === 'forward')
            step = 1;

        // switch (showType) {
        //     case "year":
        //         setDisplayedDate(new Date(displayedDate.getFullYear() + step, displayedDate.getMonth(), displayedDate.getDate()))
        //         break;
        //     default:
        //         break;
        // }
    }
   
    return (<div className={styles.Calendar__Nav__Bar}>
        <div className={styles.inner_calendar__nav__bar}>
            <Button  onClick={handleClickToday}>{tradText('Today')}</Button>
            <IconButton size='sm' variant="text">
                <FaAngleLeft size={28} onClick={() => handleTimeChange("backward")} />
            </IconButton>
            <IconButton size='sm' variant="text">
                <FaAngleRight size={28} onClick={() => handleTimeChange("forward")} />
            </IconButton>
            <Paragraph className={styles.formatted_date}>{getFormattedDate(displayedDate, tradMonthsText)}</Paragraph>
            <Notifications/>
        </div>
        <div className='flex gap-2'>


            <div className='flex gap-2'>

            {CalendarShowTypes.map((showType) => {
                return (   
                <Button
                key={"BTN_showType_" + showType.name }
                    fullWidth={true}
                    variant="outlined"
                    size='sm'
                    color='cyan'
                    onClick={() => handleChangeShowType(showType.href)}
                    >{tradText(showType.name)}</Button>)
                })
            }
            </div>
     
            <Button
                fullWidth={true}
                variant="gradient"
                size='sm'
                color='teal'
                onClick={handleOpen}
                disabled={!session?.user}
            >{tradText('AddEvent')}</Button>
        </div>
        {open && <DynamicModalCreateEvent open={open} handleOpen={handleOpen} user={session?.user} />}
    </div>
    );
}

export default CalendarNavBar;