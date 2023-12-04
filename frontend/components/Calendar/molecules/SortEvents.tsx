import Radio from "@/components/Shared/atoms/Radio";
import styles from "@/styles/Calendar.module.css"
const SortEvents = ({sortings, sortingWay, setSortingWay,selectedSorting, setSelectedSorting}) => {
    const ASC = 1;
    const DESC = -1;
    const handleChangeSelectedSorting = (event) => {
        setSelectedSorting(event.target.value);
    };
    const handleChangeSortingWay = (event) => {
        setSortingWay(event.target.value);
    };
    
    return ( 
        <div className={styles.sort__wrapper}>
            <h3 className={styles.sort__h3}>Sort</h3>
            {sortings.map((sorting) => (
              <Radio 
              key={"SORT_" + sorting}
              checked={selectedSorting == sorting}
               onChange={handleChangeSelectedSorting} 
               color="light-blue"
                value={sorting} 
                label={sorting} 
                name="sort" />
            ))
            }
            <h3 className={styles.sort__h3}>Sorting Way</h3>
            <Radio checked={sortingWay == ASC} onChange={handleChangeSortingWay} color="light-blue" value={ASC} label="Asc" name="sortWay" />
            <Radio checked={sortingWay == DESC} onChange={handleChangeSortingWay} color="light-blue" value={DESC} label="Desc" name="sortWay" />
        </div>
        

    );
}
 
export default SortEvents;