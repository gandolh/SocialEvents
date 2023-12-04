import styles from '@/styles/ThemeSwitcher.module.css';
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const handleChange = ()=>{
        if (theme == 'light')
            setTheme('dark')
        else
            setTheme('light')
    }

    return (
        <div className={styles.theme__switcher__wrapper}>
            
            <h3 className="text-black-aero-08 text-2xl mb-3"> Current theme: {theme}</h3>
            <svg width="0" height="0">
                <defs>
                    <clipPath id="moon">
                        <path d="m27.5,25c-6.904,0-12.5-5.596-12.5-12.5,0-5.76,3.897-10.606,9.196-12.055C22.843.155,21.44,0,20,0,8.954	,0,0,8.954,0,20s8.954,20,20,20,20-8.954,20-20c0-1.44-.155-2.843-.445-4.196-1.449,5.3-6.296,9.196-12.055,9.196Z" />
                    </clipPath>
                </defs>
            </svg>
            <div className='flex justify-between'>
            <label className={styles.switch}>
                <span className={styles.switch__icon + " " + styles["switch__icon--light"]}>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--1"]}></span>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--2"]}></span>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--3"]}></span>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--4"]}></span>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--5"]}></span>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--6"]}></span>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--7"]}></span>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--8"]}></span>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--9"]}></span>
                </span>
                <input className={styles.switch__input} type="checkbox" role="switch" onChange={handleChange} />
                <span className={styles["switch__icon"] + " " + styles["switch__icon--dark"]}>
                    <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--1"]}>
                        <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--1a"]}></span>
                        <span className={styles["switch__icon-part"] + " " + styles["switch__icon-part--1b"]}></span>
                    </span>
                </span>
                <span className={styles.switch__label}>Dark Mode</span>
            </label>
      
            </div>

        </div>
    );
}

export default ThemeSwitcher;