import { React, useEffect, useRef } from "react";
import Instructions from "./Instructions";
import Papa, { parse, unparse } from "papaparse";
import KommuneDropdown from "./KommuneDropdown";
import example from "../Resources/eksampel.js";
export default function InputsForm({
  handleCsvFile,
  kommuneList,
  setSelectedKommune,
  selectedKommune,
  error,
  surcharge,
  setSurcharge,
  fee,
  setFee,
  parseCsvJson,
  fixedPrice,
  setFixedPrice,
  hasFixedPrice,
  checkboxRef,
  setHasFixedPrice,
  fixComma,
  networkDayPrice,
  setNetworkDayPrice,
  networkNightOrWeekendtPrice,
  setNetworkNightOrWeekendtPrice,
  capacityPrice,
  setCapacityPrice,
  setFile,
  extractCurrentMonth,
}) {
  const capacityRef = useRef();
  const dayPriceRef = useRef();
  const nightPriceRef = useRef();
  const surchargeRef = useRef();
  const feeRef = useRef();
  const fileRef = useRef();

  function setValuealueToLocalStorage(TypeOfValue, value) {
    localStorage.setItem(TypeOfValue, value);
  }

  function saveValuestoStorage() {
    capacityPrice &&
      setValuealueToLocalStorage("SJEKK_REGNING_CAPACITY", capacityPrice);
    networkDayPrice &&
      setValuealueToLocalStorage("SJEKK_REGNING_DAY_PRICE", networkDayPrice);
    networkNightOrWeekendtPrice &&
      setValuealueToLocalStorage(
        "SJEKK_REGNING_NIGHT_PRICE",
        networkNightOrWeekendtPrice
      );
    surcharge &&
      setValuealueToLocalStorage("SJEKK_REGNING_SURCHARGE", surcharge);
    fee && setValuealueToLocalStorage("SJEKK_REGNING_FEE", fee);
  }

  useEffect(() => {
    const capacityFromStorage = localStorage.getItem("SJEKK_REGNING_CAPACITY");
    const dayPricesFromStorage = localStorage.getItem(
      "SJEKK_REGNING_DAY_PRICE"
    );
    const nightPricesFromStorage = localStorage.getItem(
      "SJEKK_REGNING_NIGHT_PRICE"
    );
    const surchargeFromStorage = localStorage.getItem(
      "SJEKK_REGNING_SURCHARGE"
    );
    const feeFromStorage = localStorage.getItem("SJEKK_REGNING_FEE");

    try {
      setCapacityPrice(capacityFromStorage);
      setNetworkDayPrice(dayPricesFromStorage);
      setNetworkNightOrWeekendtPrice(nightPricesFromStorage);
      setSurcharge(surchargeFromStorage);
      setFee(feeFromStorage);
      capacityRef.current.value = capacityFromStorage;
      dayPriceRef.current.value = dayPricesFromStorage;
      nightPriceRef.current.value = nightPricesFromStorage;
      surchargeRef.current.value = surchargeFromStorage;
      feeRef.current.value = feeFromStorage;
    } catch (error) {
      console.log(error.message);
      alert(
        "Kunne ikke bruke lagrede verdier, vennligst skriv inn verdier på nytt."
      );
    }
  }, []);

  function deleteValuesFromStorage() {
    localStorage.removeItem("SJEKK_REGNING_CAPACITY");
    localStorage.removeItem("SJEKK_REGNING_DAY_PRICE");
    localStorage.removeItem("SJEKK_REGNING_NIGHT_PRICE");
    localStorage.removeItem("SJEKK_REGNING_SURCHARGE");
    localStorage.removeItem("SJEKK_REGNING_FEE");
    setCapacityPrice();
    setNetworkDayPrice();
    setNetworkNightOrWeekendtPrice();
    setSurcharge();
    setFee();
    capacityRef.current.value = "";
    dayPriceRef.current.value = "";
    nightPriceRef.current.value = "";
    surchargeRef.current.value = "";
    feeRef.current.value = "";
  }

  useEffect(() => {
    checkboxRef.current.disabled = !hasFixedPrice;
  }, [hasFixedPrice]);

  function validateInput(input) {
    const allowedChars = new RegExp(/^[0-9\-\,\.\b]*$/);
    if (allowedChars.test(input)) {
      let correctedSurcharge = fixComma(input);
      return correctedSurcharge;
    } else {
      alert("bruk kun tall(0-9), komma(,) eller prikk(.)");
      return;
    }
  }
  return (
    <div className="d-flex">
      <div className="ms-3 border border-dark p-3 card inputs-card ">
        <div className="csv-part d-flex flex-column">
          <div className="upload mb-2">
            <label htmlFor="csvInput" style={{ display: "block" }}>
              <section>
                <p className="input-text">
                  1. Laste opp måleverdier CSV fil fra Elhub:{" "}
                </p>
                <p className="csv-file-exp">
                  Csv-fil er en fil du får fra Elhub som inneholder alle dine
                  bruksverdier for måneden.{" "}
                </p>
              </section>
            </label>
            <Instructions></Instructions>
            <input
              onChange={(e) => {
                console.log(e);
                handleCsvFile(e.target.files);
              }}
              id="csvInputBtn"
              name="file"
              type="File"
              ref={fileRef}
            />
          </div>
          <div className="network d-flex">
            <div className="d-flex flex-row">
              <div className="border border-dark d-flex flex-column card network-inputs ">
                <h4 className="ms-2 text-decoration-underline">Nettleie</h4>
                <div className="d-flex flex-column ms-2 mb-1">
                  <h5 className="me-2 network-rates-title">Fastledd:</h5>
                  <div className="d-flex">
                    <input
                      className="network-rates-inputs"
                      type="text"
                      ref={capacityRef}
                      onChange={(e) => {
                        setCapacityPrice(validateInput(e.target.value));
                      }}
                    />
                    <h6>kr</h6>
                  </div>
                  <h5 className="me-2 network-rates-title">Energiledd Dag:</h5>
                  <div className="d-flex">
                    <input
                      className="network-rates-inputs"
                      type="text"
                      ref={dayPriceRef}
                      onChange={(e) => {
                        setNetworkDayPrice(validateInput(e.target.value));
                      }}
                    />
                    <h6>
                      øre (<b>ink. avgifter!</b>)
                    </h6>
                  </div>
                  <h5 className="me-2 network-rates-title">
                    Energiledd Natt/Helg:
                  </h5>
                  <div className="d-flex">
                    <input
                      className="network-rates-inputs"
                      type="text"
                      ref={nightPriceRef}
                      onChange={(e) => {
                        setNetworkNightOrWeekendtPrice(
                          validateInput(e.target.value)
                        );
                      }}
                    />
                    <h6>
                      øre (<b>ink. avgifter!</b>)
                    </h6>
                  </div>
                </div>
              </div>
              <div className="storage-buttons-container d-flex flex-column">
                <button
                  className="save-btn btn btn-success"
                  onClick={() => {
                    saveValuestoStorage();
                  }}
                >
                  Lagre Verdier
                </button>
                <button
                  className="delete-btn btn btn-danger"
                  onClick={() => {
                    deleteValuesFromStorage();
                  }}
                >
                  Slett Verdier
                </button>
              </div>
            </div>
            <div className="tutorial">
              <p className="fw-bold tut-txt">
                Vet ikke hva du skal gjøre her? Trykk på Eksampel knappen for en
                demonstrasjon
              </p>
              <button
                className="btn btn-danger tut-btn"
                onClick={() => {
                  Papa.parse(example, {
                    header: true,
                    complete: function (results) {
                      // results object contains parsed csv data
                      let csvData = results.data;
                      console.log(csvData);
                      // create a new csv file and fill it with csvData
                      let csvFile = new File(csvData, "example.csv", {
                        type: "text/csv",
                      });
                      let list = new DataTransfer();
                      list.items.add(csvFile);
                      let myFileList = list.files;
                      console.log(myFileList);
                      fileRef.current.files = myFileList;

                      extractCurrentMonth(myFileList);
                    },
                  });
                }}
              >
                {" "}
                Eksampel
              </button>
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
        <div className="extras-container">
          <div className="d-flex flex-column">
            <div className="d-flex surcharge">
              <h3 className="me-2 surcharge-title">Påslag</h3>
              <input
                className="surcharge-input"
                type="text"
                ref={surchargeRef}
                onChange={(e) => {
                  setSurcharge(validateInput(e.target.value));
                }}
              />
              <h4>Øre</h4>
            </div>
            <div className="surcharge d-flex">
              <h3 className="me-2 surcharge-title">Månedspris</h3>
              <input
                className="surcharge-input fee"
                type="text"
                ref={feeRef}
                onChange={(e) => {
                  setFee(validateInput(e.target.value));
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
                <h4>Fast pris?</h4>
              </label>
            </div>
            <div className="d-flex flex-row ms-2">
              <input
                className="fixed-price-input"
                type="text"
                ref={checkboxRef}
                disabled
                onChange={(e) => {
                  setFixedPrice(validateInput(e.target.value));
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
