import { React, useEffect } from "react";
import Instructions from "./Instructions";
import KommuneDropdown from "./KommuneDropdown";
export default function InputsForm({
  handleCsvFile,
  kommuneList,
  setSelectedKommune,
  selectedKommune,
  error,
  setsurcharge,
  fee,
  setFee,
  parseCsvJson,
  fixedPrice,
  setFixedPrice,
  hasFixedPrice,
  checkboxRef,
  setHasFixedPrice,
  fixComma,
  CalculateWithNetowrk,
  setCalculateWithNetwork,
  networkDayPrice,
  setNetworkDayPrice,
  networkNightOrWeekendtPrice,
  setNetworkNightOrWeekendtPrice,
}) {
  useEffect(() => {
    checkboxRef.current.disabled = !hasFixedPrice;
  }, [hasFixedPrice]);

  return (
    <div className="d-flex">
      <div className="ms-3 border border-dark p-3 card inputs-card ">
        <div className="csv-part d-flex flex-column">
          <div className="upload mb-2">
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
          <div className="network">
            <div className="border border-dark d-flex flex-column w-50 card inputs-card ">
              <h4>Nettleie</h4>
              <div className="d-flex">
                <input
                  className="fixed-checkbox"
                  type="checkbox"
                  name="fixed=price-data"
                  id="fixed=price-data"
                  onClick={(e) => {}}
                />
                <label htmlFor="fixed-price-data">
                  <p>Beregne med Nettleie?</p>
                </label>
              </div>
              <div className="d-flex flex-column">
                <h5 className="me-2 network-rates-title">Energiledd Dag:</h5>
                <div className="d-flex">
                  <input
                    className="network-rates-inputs"
                    type="text"
                    value={networkDayPrice}
                    onChange={(e) => {
                      let correctedFee = fixComma(e.target.value);
                      setNetworkDayPrice(correctedFee);
                    }}
                  />
                  <h6>øre</h6>
                </div>
                <h5 className="me-2 network-rates-title">Energiledd Natt:</h5>
                <div className="d-flex">
                  <input
                    className="network-rates-inputs"
                    type="text"
                    value={networkNightOrWeekendtPrice}
                    onChange={(e) => {
                      let correctedFee = fixComma(e.target.value);
                      setNetworkNightOrWeekendtPrice(correctedFee);
                    }}
                  />
                  <h4>øre</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="drop-down d-flex flex-column">
          <h4 className="me-3">2. Velg din kommune:</h4>
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
        <div className="d-flex justify extras-container">
          <div className="d-flex flex-column">
            <div className="d-flex surcharge">
              <h3 className="me-2 surcharge-title">Påslag</h3>
              <input
                className="surcharge-input"
                type="text"
                onChange={(e) => {
                  let correctedSurcharge = fixComma(e.target.value);

                  setsurcharge(correctedSurcharge);
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
                  let correctedFee = fixComma(e.target.value);
                  setFee(correctedFee);
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
              <h4>Øre pr. kwh</h4>
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
        <div className="border fw-bold border-dark border-2 mt-3">
          All informasjonen/filene du laster opp/deler her blir ikke lagret og
          vi bruker ikke informasjonskapsler.
        </div>
      </div>
    </div>
  );
}
