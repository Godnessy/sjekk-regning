import React from "react";
import Select from "react-select";

function KommuneDropdown({ kommuneList, setSelectedKommune }) {
  //   console.log(kommuneList);
  const dropDownValues = [];

  Object.entries(kommuneList).forEach(([kommuneName, areaCode]) =>
    dropDownValues.push({ label: kommuneName, value: areaCode })
  );

  return (
    <>
      <Select
        options={dropDownValues}
        onChange={(opt) => setSelectedKommune(opt)}
      ></Select>
    </>
  );
}

export default KommuneDropdown;
