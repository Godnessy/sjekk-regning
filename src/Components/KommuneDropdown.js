import { React, useRef, useEffect } from "react";
import Select from "react-select";

function KommuneDropdown({
  kommuneList,
  setSelectedKommune,
  isDemo,
  displayValue,
  // selectedKommune,
}) {
  const dropDownValues = [];
  const kommuneRef = useRef();

  Object.entries(kommuneList).forEach(([kommuneName, areaCode]) =>
    dropDownValues.push({ label: kommuneName, value: areaCode })
  );

  // useEffect(() => {}, [displayValue]);

  return (
    <>
      <Select
        options={dropDownValues}
        ref={kommuneRef}
        inputValue={isDemo ? displayValue : undefined}
        onChange={(opt) => {
          setSelectedKommune(opt);
        }}
      ></Select>
    </>
  );
}

export default KommuneDropdown;
