import { React, useRef, useEffect } from "react";
import Select from "react-select";

function KommuneDropdown({
  kommuneList,
  setSelectedKommune,
  isDemo,
  demoValue,
}) {
  const dropDownValues = [];
  const kommuneRef = useRef();

  Object.entries(kommuneList).forEach(([kommuneName, areaCode]) =>
    dropDownValues.push({ label: kommuneName, value: areaCode })
  );

  useEffect(() => {}, [kommuneRef]);

  return (
    <>
      <Select
        options={dropDownValues}
        ref={kommuneRef}
        inputValue={isDemo ? demoValue : undefined}
        onChange={(opt) => {
          setSelectedKommune(opt);
        }}
      ></Select>
    </>
  );
}

export default KommuneDropdown;
