import React from "react";
import Instructions from "./Instructions";
import KommuneDropdown from "./KommuneDropdown";

export default function InputsForm({
  handleCsvFile,
  selectedMonth,
  setSelectedMonth,
  monthList,
  kommuneList,
  setSelectedKommune,
  selectedKommune,
  error,
  surcharge,
  setsurcharge,
  fee,
  setFee,
  parseCsvJson,
}) {
  return (
    <div className="inputs-container d-flex">
      <div className="ms-3 border border-dark p-3 card">
        <div className="csv-part">
          <label htmlFor="csvInput" style={{ display: "block" }}>
            <p className="input-text">
              1. Laste opp måleverdier CSV fil fra Elhub:{" "}
            </p>
          </label>
          <Instructions></Instructions>

          <input
            onChange={handleCsvFile}
            id="csvInput"
            name="file"
            type="File"
          />
        </div>
        <hr />
        <label htmlFor="months">
          <h3>2. Velg måned (2022): </h3>{" "}
        </label>
        <select
          name="months"
          id="months"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
          }}
        >
          <option>Valg en måned</option>
          {monthList &&
            monthList.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
        </select>
        <hr />
        <div className="drop-down d-flex flex-column">
          <h4 className="me-3">3. Velg din kommune:</h4>
          <div className="d-flex w-100 flex-column">
            <KommuneDropdown
              className="kommune-select"
              kommuneList={kommuneList}
              setSelectedKommune={setSelectedKommune}
            />
            {selectedKommune && (
              <h4> Din kommune tilhører sone: {selectedKommune.value}</h4>
            )}
          </div>
          {error && <h2 className="text-danger d-flex ">{error} </h2>}
        </div>
        <hr />
        <div className="d-flex justify">
          <div className="d-flex flex-column">
            <div className="d-flex surcharge">
              <h3 className="me-2 surcharge-title">Påslag</h3>
              <input
                className="surcharge-input"
                type="text"
                value={surcharge}
                onChange={(e) => {
                  setsurcharge(e.target.value);
                }}
              />
              <h4>Øre</h4>
            </div>
            <div className="surcharge d-flex">
              <h3 className="me-2 surcharge-title">Månedspris</h3>
              <input
                className="surcharge-input fee"
                type="text"
                value={fee}
                onChange={(e) => {
                  setFee(e.target.value);
                }}
              />
              <h4>Kr</h4>
            </div>
          </div>
          <div className="calculate-btn">
            <button
              className="calculate btn btn-success ms-5 my-3 "
              onClick={parseCsvJson}
            >
              Regne ut!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
