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
import MonthlyChart from "../Components/MonthlyChart.js";
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
    // const usageCounterRef = doc(db, "usage-counter", `usage`);
    // const usageCounterSnap = await getDoc(usageCounterRef);
    // let usageCounter = usageCounterSnap.data().usage;
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
      const strWithoutCommas = target.result.replaceAll(/['"]+/g, "");
      let csv = Papa.parse(strWithoutCommas, {
        header: false,
        quoteChar: '"',
        skipEmptyLines: true,
        complete: function (results) {
          try {
            const fixedHeaders = ["Fra", "Til", "KWH 60 Forbruk", "Kvalitet"];
            const CSVArr = [];
            if (results.data.length == 0) {
              return setError("CSV filen er tomt");
            }

            const removingOldHeaders = results.data.shift();
            const arrWithoutHeaders = results.data;
            const arrWithFixedUsage = arrWithoutHeaders.map((hour) => {
              const {
                startTime = hour[0],
                finishTime = hour[1],
                usagePart1 = hour[2],
                usagePart2 = hour[3],
              } = hour;
              const result = [
                startTime,
                finishTime,
                `${
                  isNaN(usagePart2) ? usagePart1 : usagePart1 + "." + usagePart2
                }`,
              ];
              return result;
            });
            const unParsed = Papa.unparse({
              fields: ["Fra", "Til", "KWH 60 Forbruk", "Kvalitet"],
              data: arrWithFixedUsage,
            });
            console.log(arrWithFixedUsage);
            const newResult = Papa.parse(unParsed, { header: true });
            extractCurrentMonth(newResult.data);
          } catch (error) {}
        },
      });
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
    const calculation = (monthlyAvg - 87.5) * 0.9;
    return calculation;
  };

  useEffect(() => {}, [selectedKommune]);
  useEffect(() => {}, [totalMonthPrice]);

  const extractCurrentMonth = async (usageData) => {
    const month = usageData[0].Fra.split(".")[1];
    setSelectedMonth(monthObj[month]);
    const prices = await getMonthPrices(monthObj[month]);
    calculateMonthlyValues(usageData, prices);
  };

  const fixComma = (str) => {
    const fixed = str.replace(",", ".");
    return Number(fixed);
  };

  function calculateMonthlyValues(usageData, prices) {
    function extractUsage(value) {
      return value.replace(",", ".");
    }
    setsurcharge(surcharge);
    // console.log(usageData);
    const dataForHour = usageData.map((hour, idx) => {
      const values = hour.Fra.split(" ");
      const date = values[0];
      idx == usageData.length - 1 && setLastDay(date);
      const time = values[1];
      const usage = extractUsage(hour["KWH 60 Forbruk"]);
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
          <div className="inputs-container justify-content-center my-2 d-flex flex-column">
            <div className="align-self-center">
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
            <button
              className="reset-btn calculate-after w-25 align-self-center btn btn-danger ms-5 my-3"
              onClick={() => {
                window.location.reload();
              }}
            >
              Ny regning
            </button>
            <div className="align-self-center chart">
              <MonthlyChart usageData={usageData} />
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
