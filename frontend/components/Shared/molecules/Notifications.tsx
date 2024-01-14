
import styles from '@/styles/Notifications.module.css'
import { FaBell, FaChild } from "react-icons/fa6";
import { useSession } from "next-auth/react";
 import { getNotifications } from '@/components/utils/ApiCallers/ServerApiCallers';
import { useState, useEffect, useMemo} from 'react';
import { Notification } from '@/types/Notification';
import { getDateStringFromDate } from '@/components/utils/DateFormat';
const Notifications = () => {
    const {data : session } = useSession();
    const [notifs, setNotifs] = useState([] as Notification[]);
   


    useEffect(() => {
        const fetchNotifications = async () => {
            if(!session?.user?.email)
            return;
        
            getNotifications(session.user.email)
            .then(res =>{
                const newNotifs = res.notifications.map(el => ({...el, date: new Date(el.date)}));
                setNotifs(newNotifs)
            } 
            );
        }
        fetchNotifications();
    }, [ session?.user?.email]);
    const notificationsNumber = useMemo(() => notifs?.length ?? 0, [notifs]);
    
    return (
        <div className={styles.notification}>
            <div className={styles.notBtn}>
                <div className={styles.number}>{notificationsNumber}</div>
                <FaBell className={styles.fas} />
                <div className={styles.box}>
                    <div className={styles.display}>
                        <div className={styles.nothing}>
                            <FaChild className={styles.fas + " " + styles.stick} />
                            <div className={styles.cent}>Nu aveti notificari!</div>
                        </div>
                        <div className={styles.cont}>
                            {notifs?.map((notification : Notification) => (
                            <div key={notification.msg + ' ' + notification.date.toISOString()} className={styles.sec + " " + styles.new}>
                                <div className={styles.txt}>{notification.msg}</div>
                                <div className={styles.txt + " " + styles.sub}>{getDateStringFromDate(notification?.date)}</div>
                            </div>
                                )
                            )
                        }


                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Notifications;