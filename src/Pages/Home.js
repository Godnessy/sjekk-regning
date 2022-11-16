import { useState, useEffect, useRef } from "react";
import Papa, { parse, unparse } from "papaparse";
import { Card, Nav } from "react-bootstrap";
import { db } from "../firebase-config.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.js";
import kommunes from "../Resources/kommuneList.json";
import KommuneDropdown from "../Components/KommuneDropdown";
import DailyPrices from "../Components/DailyPrices.js";
import HourlyPrices from "../Components/HourlyPrices.js";
import Navbar from "../Components/Navbar.js";
import Instructions from "../Components/Instructions.js";
import Results from "../Components/Results.js";
import InputsForm from "../Components/InputsForm.js";
import BioLink from "../Components/BioLink.js";
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
  const [govSupport, setGovSupport] = useState(0);
  const [myGovSupport, setMyGovSupport] = useState(0);
  const [networkDayPrice, setNetworkDayPrice] = useState(0);
  const [networkNightPrice, setNetworkNightPrice] = useState(0);
  const [totalKwh, setTotalKwh] = useState();
  const [fixedPrice, setFixedPrice] = useState(0);
  const [hasFixedPrice, setHasFixedPrice] = useState(false);
  const checkboxRef = useRef();
  let tempMonthPrice = 0;
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

  const getMonthPrices = async (month) => {
    const monthRef = doc(db, "price-history", `${month}-22`);
    //quick way to track usage while in beta - will be removed.
    // const usageCounterRef = doc(db, "usage-counter", `usage`);
    // const usageCounterSnap = await getDoc(usageCounterRef);
    // let usageCounter = usageCounterSnap.data().usage;
    // console.log(usageCounter + 1);
    // await setDoc(usageCounterRef, { usage: usageCounter + 1 });
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
      const fileExtension = inputFile?.type.split("/")[1];
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
            results.data.map((item) => {
              const splitLineIntoArr = item.Fra.split("");
              const findLastCommaIndex = splitLineIntoArr.lastIndexOf(",");
              splitLineIntoArr.splice(findLastCommaIndex, 1, ".");
              const fixedLineStr = [splitLineIntoArr.join("")];
              const fixedLine = fixedLineStr[0].split(",");
              CSVArr.push(fixedLine);
            });
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
    setTotalKwh(totalUsage);
  }

  function convertCommaToNumber(str) {
    console.log(str);
    const fixComma = str.replace(",", ".");
    console.log(fixComma);
    const newResult = Number(fixComma);
    console.log(newResult);
    return newResult;
  }

  if (window.innerWidth < 750) {
    console.log("potato");
    return (
      <div>
        <Navbar></Navbar>
        <div className="align-self-center m-5">
          <Card>
            SjekkRegn er ikke tilpasset for mobiltelefoner ennå. Bruk et
            nettbrett eller en datamaskin for å få tilgang til SjekkRegning.no.
            Mobilstøtte kommer snart!
          </Card>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="d-flex flex-row justify-content-center">
            <div className="d-flex justify-content-center my-2">
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
                totalMonthPrice={totalMonthPrice}
              />
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
                  selectedKommune={selectedKommune}
                />
              )}
            </div>
          </div>
        </div>

        <div className="usage-price-container my-2 d-flex">
          <div className="ms-3">
            {usageData && (
              <HourlyPrices
                dataForHour={usageData}
                hasFixedPrice={hasFixedPrice}
                fixedPrice={fixedPrice}
              />
            )}
          </div>
          <div className="me-4">
            {usageData && (
              <DailyPrices
                dataForHour={usageData}
                totalMonthPrice={totalMonthPrice}
                hasFixedPrice={hasFixedPrice}
                fixedPrice={fixedPrice}
              />
            )}
          </div>
        </div>
        {!totalMonthPrice && (
          <div className="bio-link d-flex mt-5 justify-content-center">
            <BioLink></BioLink>
          </div>
        )}
      </>
    );
    // }
  }
}

export default Home;
