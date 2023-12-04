type DropdownProps = {
  handleOnChange: (value: string) => void;
  values: any[];
  defaultLabel: string;
  selectedValue: any;
  textColor?: string;
}

const Dropdown = ({ handleOnChange, values, selectedValue, textColor}: DropdownProps) => {

  const valueChanged = (event) => {
    handleOnChange(event.target.value);
  }
  textColor = textColor ?? "blue-gray-700";
  const selectClassnames =
    `w-full h-full bg-transparent text-${textColor} font-sans p-3` +
    " font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50" +
    " disabled:border-0 transition-all placeholder-shown:border" +
    " placeholder-shown:border-blue-gray-200" +
    " placeholder-shown:border-t-blue-gray-200 border focus:border-2" +
    " border-t-transparent focus:border-t-transparent text-sm px-3" +
    " py-2.5 rounded-[7px] border-blue-gray-200 focus:border-blue-500"

  const labelClassnames = "flex w-full h-full select-none pointer-events-none" + 
  " absolute left-0 font-normal leading-tight -top-1.5 text-[11px]" + 
  " before:content[' '] before:block" + 
  " before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1" + 
  " before:rounded-tl-md before:border-t before:border-l" + 
  " after:content[' '] after:block after:flex-grow after:w-2.5 after:h-1.5 after:mt-[6.5px]" + 
  " after:ml-1 after:rounded-tr-md after:border-t after:border-r" + 
  " after:pointer-events-none after:transition-all" + 
  ` text-${textColor} before:border-blue-gray-200 after:border-blue-gray-200`


  return (
    <>
      <div className="relative w-full min-w-[200px] h-10">
        <select onChange={valueChanged} value={selectedValue}
          className={selectClassnames}>
          {values.map((value) =>
            <option
              key={"angajat_" + value}
              value={value}
              className="text-blue-gray-700">
              {value}
            </option>
          )}
        </select>
        <label className={labelClassnames}>
          Category
        </label>
      </div>
    </>
  );
}

export default Dropdown;