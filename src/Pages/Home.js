import { useState, useEffect, useRef } from "react";
import Papa, { parse, unparse } from "papaparse";
import { db } from "../firebase-config.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import kommunes from "../Resources/kommuneList.json";
import KommuneDropdown from "../Components/KommuneDropdown";
import DailyPrices from "../Components/DailyPrices.js";
import HourlyPrices from "../Components/HourlyPrices.js";
import Navbar from "../Components/Navbar.js";
import Instructions from "../Components/Instructions.js";
import Results from "../Components/Results.js";
import InputsForm from "../Components/InputsForm.js";
import BioLink from "../Components/BioLink.js";
const storage = getStorage();

const allowedExtensions = ["csv"];

function Home() {
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [usageData, setUsageData] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [kommuneList, setKommuneList] = useState(kommunes);
  const [selectedKommune, setSelectedKommune] = useState();
  const [totalMonthPrice, setTotalMonthPrice] = useState();
  const [surcharge, setsurcharge] = useState("0");
  const [fee, setFee] = useState(0);
  const [lastDay, setLastDay] = useState("");
  const [avgMonthly, setAvgMonthly] = useState(0);
  const [govSupport, setGovSupport] = useState(0);
  const [myGovSupport, setMyGovSupport] = useState(0);
  const [networkDayPrice, setNetworkDayPrice] = useState(0);
  const [networkNightPrice, setNetworkNightPrice] = useState(0);
  const [totalKwh, setTotalKwh] = useState();
  const [fixedPrice, setFixedPrice] = useState(0);
  const [hasFixedPrice, setHasFixedPrice] = useState(false);
  const checkboxRef = useRef();
  const fileRef = ref(storage, file.name);

  let tempUploadedObj = [];
  let tempMonthPrice = 0;
  let tempMonthAvg = 0;
  let totalUsage = 0;
  let hoursCounter = 0;
  let avgPriceTimesUsage = 0;
  const monthObj = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const uploadFailedFile = async () => {
    if (!file) {
      alert("Kan ikke se at en fil var velgt");
      return;
    }
    try {
      const storageRef = ref(storage, file?.name);
      uploadBytes(storageRef, file).then((snapshot) => {});
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMonthPrices = async (month) => {
    const monthRef = doc(db, "price-history", `${month}-22`);
    //quick way to track usage while in beta - will be removed.
    const usageCounterRef = doc(db, "usage-counter", `usage`);
    const usageCounterSnap = await getDoc(usageCounterRef);
    let usageCounter = usageCounterSnap.data().usage;
    console.log(usageCounter + 1);
    await setDoc(usageCounterRef, { usage: usageCounter + 1 });
    try {
      const docSnap = await getDoc(monthRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("Doc does not exist");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCsvFile = (e) => {
    setError("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile.type.split("/")[1];
      setFile(inputFile);
    }
  };
  const parseCsvJson = () => {
    if (!file) return setError("Har du glemt å velge CSV fil?");
    else if (!selectedKommune) return setError("Velg kommune fra listen");
    setError("");
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      let newResult;
      tempUploadedObj = target.result;
      let csv = Papa.parse(target.result, {
        header: true,
        quoteChar: '"',
        skipEmptyLines: true,
        transform: (val, col) => {
          const removeQuotations = val.replaceAll(/['"]+/g, "");
          const doubleCommasRegex = /,,/i;
          const removeDoubleCommas = removeQuotations.replace(
            doubleCommasRegex,
            ""
          );
          return removeQuotations;
        },
        complete: function (results) {
          const CSVArr = [];
          if (results.data.length == 0) {
            return setError("CSV filen er tomt");
          }
          if (!results.data[0].Til) {
            try {
              results.data.map((item) => {
                const splitLineIntoArr = item.Fra.split("");
                const findLastCommaIndex = splitLineIntoArr.lastIndexOf(",");
                splitLineIntoArr.splice(findLastCommaIndex, 1, ".");
                const fixedLineStr = [splitLineIntoArr.join("")];
                const fixedLine = fixedLineStr[0].split(",");
                CSVArr.push(fixedLine);
              });
            } catch (error) {
              // if (file) {
              //   uploadFailedFile();
              // }
              alert(
                `Error under forsøk på å analysere regningen. Vennligst hjelp oss med å finne problemet ved å klikke på Rapporter feil-knappen øverst på skjermen.`
              );
              return;
            }
            const unParsed = Papa.unparse({
              fields: ["Fra", "Til", "KWH 60 Forbruk"],
              data: CSVArr,
            });
            newResult = Papa.parse(unParsed, { header: true });
          }
        },
      });
      if (newResult) {
        extractCurrentMonth(newResult.data, false);
      } else {
        extractCurrentMonth(csv.data, true);
      }
    };
    reader.readAsText(file);
  };

  const collectDayPrices = (prices, date) => {
    return prices[date];
  };

  const createSelectedPriceZone = (selectedZone, priceObjForDay) => {
    if (priceObjForDay) {
      return priceObjForDay[selectedZone];
    } else {
      return "test";
    }
  };

  const createPriceForHour = (zonePrices, time) => {
    if (zonePrices) {
      const basePrice = Number(zonePrices[time]);
      tempMonthAvg = tempMonthAvg + basePrice;
      const calculatedPrice = basePrice + Number(surcharge);
      return calculatedPrice;
    } else {
      return 0;
    }
  };
  const createTotalPricePrHour = (usage, priceForHour) => {
    if (priceForHour) {
      const basePrice = hasFixedPrice ? fixedPrice : priceForHour;
      const totalPrice = (basePrice / 100) * Number(usage);
      tempMonthPrice = tempMonthPrice += totalPrice;

      return totalPrice;
    }
    return 0;
  };

  const createGovSupport = (monthlyAvg) => {
    console.log(monthlyAvg);
    const calculation = (monthlyAvg - 87.5) * 0.9;
    console.log(`strømstøtte er ${calculation}`);
    return calculation;
  };

  useEffect(() => {}, [selectedKommune]);
  useEffect(() => {}, [totalMonthPrice]);

  const extractCurrentMonth = async (usageData, isNew) => {
    const month = usageData[0].Fra.split(".")[1];
    setSelectedMonth(monthObj[month]);
    const prices = await getMonthPrices(monthObj[month]);
    if (isNew) {
      calculateMonthlyValues(usageData, true, prices);
    } else {
      calculateMonthlyValues(usageData, false, prices);
    }
  };

  const fixComma = (str) => {
    const fixed = str.replace(",", ".");
    return Number(fixed);
  };

  function calculateMonthlyValues(usageData, isNew, prices) {
    function extractUsage(value, NeedsFixing) {
      const newValue = NeedsFixing ? value.replace(",", ".") : value;
      return newValue;
    }
    setsurcharge(surcharge);
    const dataForHour = usageData.map((hour, idx) => {
      const values = hour.Fra.split(" ");
      const date = values[0];
      idx == usageData.length - 1 && setLastDay(date);
      const time = values[1];
      const usage = extractUsage(hour["KWH 60 Forbruk"], isNew);
      const dayPrices = collectDayPrices(prices, date);
      const selectedZonePrices = createSelectedPriceZone(
        selectedKommune.value,
        dayPrices
      );
      totalUsage = totalUsage + Number(usage);
      hoursCounter++;
      const priceForHour = createPriceForHour(selectedZonePrices, time);
      if (!isNaN(priceForHour)) {
        avgPriceTimesUsage = avgPriceTimesUsage + priceForHour * usage;
      }
      const totalPricePrHour = createTotalPricePrHour(usage, priceForHour);

      return {
        values,
        date,
        time,
        usage,
        dayPrices,
        selectedZonePrices,
        priceForHour,
        totalPricePrHour,
      };
    });

    const totalMonthPrice = dataForHour.reduce((result, item, index) => {
      return result + item.totalPricePrHour;
    }, 0);
    setTotalMonthPrice(totalMonthPrice);
    setUsageData(dataForHour);
    setAvgMonthly(tempMonthAvg / hoursCounter);
    setGovSupport(createGovSupport(tempMonthAvg / hoursCounter));
    setTotalKwh(totalUsage);
  }

  function convertCommaToNumber(str) {
    const fixComma = str.replace(",", ".");
    const newResult = Number(fixComma);
    return newResult;
  }

  if (!usageData) {
    return (
      <>
        <Navbar uploadFailedFile={uploadFailedFile} file={file} />
        <div className="start-container d-flex flex-column ">
          <div className="site-descrip d-flex flex-column align-self-center mt-4">
            {" "}
            <h2 className="description-text align-self-center ms-2 me-2">
              Velkommen til SjekkRegning.no!
            </h2>
            <h4 className="description-text align-self-center ms-2 me-2">
              Her kan du sjekke om strømregning du fikk er korrekt eller om du
              har betalt for mye eller sjekke denne måneds forbruk.
            </h4>
          </div>
          <div className="d-flex flex-column container justify-content-center">
            <div className="d-flex justify-content-center my-5">
              <InputsForm
                handleCsvFile={handleCsvFile}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                kommuneList={kommuneList}
                setSelectedKommune={setSelectedKommune}
                selectedKommune={selectedKommune}
                error={error}
                surcharge={surcharge}
                setsurcharge={setsurcharge}
                fee={fee}
                setFee={setFee}
                parseCsvJson={parseCsvJson}
                fixedPrice={fixedPrice}
                setFixedPrice={setFixedPrice}
                hasFixedPrice={hasFixedPrice}
                checkboxRef={checkboxRef}
                setHasFixedPrice={setHasFixedPrice}
                convertCommaToNumber={convertCommaToNumber}
                fixComma={fixComma}
              />
            </div>
            <div className="bio-link d-flex mt-5 justify-content-center">
              <BioLink></BioLink>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Navbar />

        <div className="page-container">
          <div className="inputs-container justify-content-center my-2 d-flex">
            <div className="ms-3 border  border-dark p-3 inputs-card card">
              <div className="csv-part">
                <label htmlFor="csvInput" style={{ display: "block" }}>
                  <p className="input-text">
                    1. Laste opp måleverdier CSV fil fra Elhub:
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
                {error && <p className="text-danger d-flex ">{error} </p>}
              </div>
              <hr />
              <div className="inputs-and-button d-flex justify">
                <div className="d-flex flex-column">
                  <div className="d-flex surcharge">
                    <h3 className="me-2 surcharge-title">Påslag</h3>
                    <input
                      className="surcharge-input"
                      type="text"
                      value={surcharge}
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
                        setFee(e.target.value);
                      }}
                    />
                    <h4>Kr</h4>
                  </div>
                  {hasFixedPrice && <h3>Fast kwh pris: {fixedPrice} Øre</h3>}
                </div>
                <div className="calculate-btn">
                  {totalMonthPrice ? (
                    <button
                      className="calculate calculate-after btn btn-danger ms-5 my-3"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Ny regning
                    </button>
                  ) : (
                    <button
                      className="calculate btn btn-success ms-5 my-3 "
                      onClick={parseCsvJson}
                    >
                      Regne ut!
                    </button>
                  )}
                </div>
              </div>
              <div className="border fw-bold border-dark border-2">
                All informasjonen/filene du laster opp/deler her blir ikke
                lagret og vi bruker ikke informasjonskapsler.
              </div>
              {usageData && (
                <div className="w-100">
                  {" "}
                  <hr />
                  <p className="mx-2 align-self-center mt-2">
                    <mark>
                      Fant du en betydelig forskjell mellom våre beregninger og
                      din regning?
                    </mark>
                    Vi anbefaler deg å ta kontakt med Ole Nyborg Markussen på{" "}
                    <a href="http://https://www.facebook.com/groups/1055189454988378">
                      {" "}
                      Prismatch Strøm
                    </a>{" "}
                    som hjelper folk med denne typen problemer - gratis.
                  </p>
                </div>
              )}
            </div>
            <div>
              {totalMonthPrice && (
                <Results
                  totalMonthPrice={totalMonthPrice}
                  fee={fee}
                  totalUsage={totalKwh}
                  month={selectedMonth}
                  surcharge={surcharge}
                  selectedMonth={selectedMonth}
                  hasFixedPrice={hasFixedPrice}
                  fixedPrice={fixedPrice}
                  avgPrice={avgMonthly}
                  govSupport={govSupport}
                  lastDay={lastDay}
                  zone={selectedKommune.value}
                />
              )}
            </div>
          </div>

          <div className="usage-price-container my-2 d-flex ">
            <div className="daily-prices me-4">
              {usageData && (
                <DailyPrices
                  dataForHour={usageData}
                  totalMonthPrice={totalMonthPrice}
                  hasFixedPrice={hasFixedPrice}
                  fixedPrice={fixedPrice}
                />
              )}
            </div>
            <div className=" hourly-prices ms-3">
              {usageData && (
                <HourlyPrices
                  dataForHour={usageData}
                  hasFixedPrice={hasFixedPrice}
                  fixedPrice={fixedPrice}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
