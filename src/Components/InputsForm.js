import { React, useEffect } from "react";
import Instructions from "./Instructions";
import KommuneDropdown from "./KommuneDropdown";
import potato from "./potato";

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
  fixedPrice,
  setFixedPrice,
  hasFixedPrice,
  checkboxRef,
  setHasFixedPrice,
}) {
  useEffect(() => {
    checkboxRef.current.disabled = !hasFixedPrice;
  }, [hasFixedPrice]);

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
          <div className="fixed-price border border-2 border-dark">
            <div>
              <input
                className="fixed-checkbox ms-2"
                type="checkbox"
                name="fixed=price-data"
                id="fixed=price-data"
                onClick={(e) => {
                  setHasFixedPrice(!hasFixedPrice);
                }}
              />
              <label htmlFor="fixed-price-data">
                <h4>Har du fast pris?</h4>
              </label>
            </div>
            <div className="d-flex flex-row ms-2">
              <input
                className="fixed-price-input"
                type="number"
                ref={checkboxRef}
                disabled
                value={fixedPrice}
                onChange={(e) => {
                  setFixedPrice(e.target.value);
                }}
              />
              <h4>Øre</h4>
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
