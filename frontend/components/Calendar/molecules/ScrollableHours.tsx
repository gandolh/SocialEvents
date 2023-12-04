import styles from "@/styles/Calendar.module.css"

const ScrollableHours = ({ hours }) => {
    return (
        <div>
            {hours.map((hour) => {
                return (
                    <div key={hour} className={styles.scrollable__hours}>
                        <span className="absolute -top-5">{hour}:00</span>
                    </div>
                )
            })}
        </div>
    );
}

export default ScrollableHours;    