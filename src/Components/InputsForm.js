import { React, useEffect, useRef, useState } from "react";
import Instructions from "./Instructions";
import Papa, { parse, unparse } from "papaparse";
import KommuneDropdown from "./KommuneDropdown";
import example from "../Resources/eksampel.js";
import Example from "./Example";
export default function InputsForm({
  file,
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
  otherFees,
  setOtherFees,
  setCapacityPrice,
  setFile,
  extractCurrentMonth,
  formatCSVFile,
  isDemo,
  setIsDemo,
}) {
  const capacityRef = useRef();
  const dayPriceRef = useRef();
  const nightPriceRef = useRef();
  const surchargeRef = useRef();
  const feeRef = useRef();
  const fileRef = useRef();
  const otherFeesRef = useRef();
  const exampleDivRef = useRef();
  const exampleDiv2Ref = useRef();
  const calculateBtnRef = useRef();
  const [demoUsageValues, setDemoUsageValues] = useState(example);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function setValuealueToLocalStorage(TypeOfValue, value) {
    localStorage.setItem(TypeOfValue, value);
  }

  const demoButtonDiv = () => {
    return (
      <>
        <p className="fw-bold tut-txt">
          Vet ikke hva du skal gjøre her? Trykk på Eksampel knappen for en
          demonstrasjon
        </p>
        <button
          className="btn btn-danger tut-btn"
          onClick={() => {
            setupDemoValues();
          }}
        >
          Demo
        </button>
      </>
    );
  };
  const changeDivDisplay = (windowWidth) => {
    if (!isDemo) {
      const div1 = exampleDivRef.current.classList;
      const div2 = exampleDiv2Ref.current.classList;
      if (windowWidth > 800) {
        div1.remove("hidden");
        div2.add("hidden");
      } else {
        div2.remove("hidden");
        div1.add("hidden");
      }
    } else {
      return;
    }
  };

  const handleResize = (windowWidth) => {
    const div1 = exampleDivRef.current.classList;
    const div2 = exampleDiv2Ref.current.classList;
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
    changeDivDisplay(windowWidth);
  };

  useEffect(() => {
    handleResize(windowWidth);
  }, []);

  useEffect(() => {
    changeDivDisplay(windowWidth);
  }, [windowWidth]);

  useEffect(() => {
    if (
      file &&
      networkDayPrice &&
      networkNightOrWeekendtPrice &&
      capacityPrice &&
      selectedKommune &&
      fee &&
      surcharge
    ) {
      calculateBtnRef.current.classList.add("demo-btn");
    }
  }, [
    file,
    networkDayPrice,
    networkNightOrWeekendtPrice,
    capacityPrice,
    selectedKommune,
    fee,
    surcharge,
  ]);

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
  function updateUI(element, value) {
    return (element.current.value = value);
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
      setCapacityPrice(Number(capacityFromStorage));
      setNetworkDayPrice(Number(dayPricesFromStorage));
      setNetworkNightOrWeekendtPrice(Number(nightPricesFromStorage));
      setSurcharge(Number(surchargeFromStorage));
      setFee(Number(feeFromStorage));
      updateUI(capacityRef, capacityFromStorage);
      updateUI(dayPriceRef, dayPricesFromStorage);
      updateUI(nightPriceRef, nightPricesFromStorage);
      updateUI(surchargeRef, surchargeFromStorage);
      updateUI(feeRef, feeFromStorage);
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

  function setupDemoValues() {
    setIsDemo(true);
    Papa.parse(example, {
      header: true,
      complete: function (results) {
        let csvData = results.data;
        let csvFile = new File(csvData, "example.csv", {
          type: "text/csv",
        });
        let list = new DataTransfer();
        list.items.add(csvFile);
        let myFileList = list.files;
        fileRef.current.files = myFileList;
        setFile(myFileList[0]);
        updateUI(capacityRef, 350);
        setCapacityPrice(350);
        updateUI(dayPriceRef, "49,9");
        setNetworkDayPrice(49.9);
        updateUI(nightPriceRef, "39,9");
        setNetworkNightOrWeekendtPrice(39.9);
        updateUI(surchargeRef, "0,78");
        setSurcharge(0.79);
        updateUI(feeRef, 39);
        setFee(39);
        setSelectedKommune({ label: "Oslo", value: "NO1" });
      },
    });
  }

  const displayDemoResults = () => {
    const resultsArr = [];
    const strWithouQuotationsMarks = demoUsageValues.replaceAll(/['"]+/g, "");
    const CSVinArr = strWithouQuotationsMarks.split("\n");
    CSVinArr.map((arr) => {
      const splitArr = arr.split(",");
      resultsArr.push(splitArr);
    });
    const formattedCSV = formatCSVFile(resultsArr);
    const parsedExampleJSON = Papa.parse(formattedCSV, { header: true });
    extractCurrentMonth(parsedExampleJSON.data);
  };

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
    <div className="d-flex flex-column">
      {!isDemo && (
        <div ref={exampleDiv2Ref} className="tutorial2 hidden">
          {demoButtonDiv()}
        </div>
      )}
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
              {isDemo && (
                <p className="elhub-instructions">
                  Veiledning med bilder for Elhub ⬇️
                </p>
              )}
            </label>
            <Instructions></Instructions>
            {isDemo && (
              <div className="file-instructions">
                <p> ⬇️ Her velger du CSV filen fra Elhub</p>
              </div>
            )}
            <input
              onChange={(e) => {
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
                  <h5 className="me-2 network-rates-title">1. Fastledd:</h5>
                  <div className="d-flex">
                    <input
                      className="network-rates-inputs capacity-input"
                      type="text"
                      ref={capacityRef}
                      onChange={(e) => {
                        setCapacityPrice(validateInput(e.target.value));
                      }}
                    />
                    <h6>kr</h6>
                  </div>
                  <h5 className="me-2 network-rates-title">
                    2. Energiledd Dag:
                  </h5>
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
                      øre (<b className="abc">ink. avgifter!</b>)
                    </h6>
                  </div>
                  <h5 className="me-2 network-rates-title">
                    3. Energiledd Natt/Helg:
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
                      øre (<b className="abc">ink. avgifter!</b>)
                    </h6>
                  </div>
                </div>
              </div>
              {!isDemo ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="network-help d-flex flex-column">
                    {" "}
                    {/* <div className="network-help-header"> */}
                    <h5>{`<-`}Her Skriver du Nettleie elementer</h5>
                    {/* </div> */}
                    <h5 className="example-capacity">
                      1. Kapasitet ledd - avhenger av dine 3 høyeste brukstimer
                      - Se fakturaen din for riktige sum.
                    </h5>
                    <h5>2.Dag satser </h5>
                    <h5>3.Nett/Helg satser</h5>
                    <h5>
                      Husk at Dag og natt satser må skrives ink ENOVA,
                      Merverdiavgift og El-avgift - Sjekk fakturaen din for
                      riktige summer.
                    </h5>
                  </div>
                </>
              )}
            </div>

            {!isDemo ? (
              <div ref={exampleDivRef} className="tutorial">
                {demoButtonDiv()}
              </div>
            ) : (
              <div className="example">
                <button
                  className="btn btn-danger exit-example"
                  onClick={() => window.location.reload()}
                >
                  Forlat Eksampel
                </button>{" "}
                <div className="Example-txt">Eksampel</div>
              </div>
            )}
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
              isDemo={isDemo}
              demoValue={"Oslo"}
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
            <div className="other-fees-container d-flex flex-column">
              <div className="other-fees d-flex">
                <h3 className="other-fees-title me-1 ">Andre gebyrer</h3>
                <input
                  className="surcharge-input other-fees-input "
                  type="text"
                  ref={otherFeesRef}
                  onChange={(e) => {
                    setOtherFees(validateInput(e.target.value));
                  }}
                />
                <h4>Kr</h4>
              </div>
              <p className="other-fees-txt">
                ⬆️f.esk Tripple-Garanti,opprinnelsesgaranti osv.
              </p>
            </div>
          </div>
          <div className="fixed-price-container d-flex flex-column">
            {" "}
            {isDemo && (
              <p className="fixed-price-example">
                ⬇️Har du fast pris? Klikk på boksen
              </p>
            )}
            <div className="fixed-price border border-2 border-dark">
              <div className="fixed-price-checkbox-container">
                <input
                  className="fixed-checkbox ms-2"
                  type="checkbox"
                  onClick={(e) => {
                    setHasFixedPrice(!hasFixedPrice);
                  }}
                />

                <h4>Fast pris?</h4>
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
          </div>
          <div className="calculate-btn">
            <button
              ref={calculateBtnRef}
              className={
                !isDemo
                  ? "calculate btn btn-success my-3 "
                  : "calculate demo-btn btn btn-success my-3"
              }
              onClick={() => {
                !isDemo ? parseCsvJson() : displayDemoResults();
              }}
            >
              Regne ut!
            </button>
          </div>
        </div>
        <div className="border cookies-dec fw-bold border-dark border-2">
          All informasjonen/filene du laster opp/deler her blir ikke lagret og
          vi bruker ikke informasjonskapsler.
        </div>
      </div>
    </div>
  );
}
