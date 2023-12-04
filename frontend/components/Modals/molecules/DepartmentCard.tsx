import XIcon from "@/components/Shared/atoms/XIcon";

const DepartmentCard = ({ remove_dept, dept, selected, onClick }) => {
    return (
        <>
            <div className={`${selected ? " border border-black-aero-02" : 'bg-transparent'} 
                 relative flex justify-between items-center p-2 rounded-lg`} 
                 onClick={onClick}
                 >
                <p className={`${selected ? " text-black-aero-08" : 'text-gray-700'} font-semibold`}
                    >
                    {dept.name}
                </p>
                {dept.name !== "Guest" && <span
                    className='cursor-pointer'
                    onClick={() => remove_dept(dept)}>
                    <XIcon variant='outlined' />
                </span>}
            </div>
        </>
    );
}

export default DepartmentCard;