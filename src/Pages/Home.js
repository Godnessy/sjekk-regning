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
import Loading from "../Components/Loading.js";
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
  const [surcharge, setSurcharge] = useState(0);
  const [fee, setFee] = useState(0);
  const [lastDay, setLastDay] = useState("");
  const [avgMonthly, setAvgMonthly] = useState(0);
  const [govSupport, setGovSupport] = useState(0);
  const [usageDayHours, setUsageDayHours] = useState(0);
  const [usageNightHours, setUsageNightHours] = useState(0);
  const [networkDayPrice, setNetworkDayPrice] = useState("0");
  const [networkNightOrWeekendtPrice, setNetworkNightOrWeekendtPrice] =
    useState("0");
  const [totalKwh, setTotalKwh] = useState();
  const [fixedPrice, setFixedPrice] = useState(0);
  const [hasFixedPrice, setHasFixedPrice] = useState(false);
  const [capacityPrice, setCapacityPrice] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const checkboxRef = useRef();

  const fileRef = ref(storage, file.name);
  let capacitySet = new Set();
  let tempMonthPrice = 0;
  let tempMonthAvg = 0;
  let totalUsage = 0;
  let hoursCounter = 0;
  let avgPriceTimesUsage = 0;
  let dayNightHoursCounter = { day: 0, night: 0 };
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
      uploadBytes(storageRef, file);
    } catch (error) {}
  };

  const getMonthPrices = async (month) => {
    const monthRef = doc(db, "price-history", `${month}-22`);
    //quick way to track usage while in beta - will be removed.
    const usageCounterRef = doc(db, "usage-counter", `usage`);
    const usageCounterSnap = await getDoc(usageCounterRef);
    let usageCounter = usageCounterSnap.data().usage;
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
    setIsLoading(true);
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

  const extractDifferentRates = (hour, usageForhour, isWeekend) => {
    const extractNumberFromHour = Number(hour.split(":")[0]);
    const nightHours = dayNightHoursCounter.night;
    const dayHours = dayNightHoursCounter.day;
    if (isWeekend) {
      dayNightHoursCounter.night = nightHours + usageForhour;
    } else {
      //stuck here, calculation doesnt work and everything gets taken for day hour, checked type and its number.
      if (extractNumberFromHour >= 22 || extractNumberFromHour <= 5) {
        return (dayNightHoursCounter.night = nightHours + usageForhour);
      } else {
        return (dayNightHoursCounter.day = dayHours + usageForhour);
      }
    }
  };
  const checkIsWeekend = (date, time, usage) => {
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var d = new Date(date.split(".").reverse().join("/"));
    if (days[d.getDay()] == "Sunday" || days[d.getDay()] == "Saturday") {
      return extractDifferentRates(time, usage, true);
    } else return extractDifferentRates(time, usage, false);
  };

  //Needed because Norwegians write floats with a comma instead of a dot and it messes the math up in JS.
  const fixComma = (str) => {
    const fixed = str.replace(",", ".");
    return Number(fixed);
  };

  function setCapacityRates(capacitySet) {
    const capacityArr = Array.from(capacitySet);
    const sortedCapacityarr = capacityArr.sort((a, b) => a > b);
  }

  function calculateMonthlyValues(usageData, prices) {
    setSurcharge(surcharge);

    const dataForHour = usageData.map((hour, idx) => {
      const values = hour.Fra.split(" ");
      const date = values[0];
      idx == usageData.length - 1 && setLastDay(date);
      const time = values[1];
      const usage = Number(hour["KWH 60 Forbruk"]);
      capacitySet.add(usage);
      const isWeekend = checkIsWeekend(date, time, usage);
      const dayPrices = collectDayPrices(prices, date);
      const selectedZonePrices = createSelectedPriceZone(
        selectedKommune.value,
        dayPrices
      );
      totalUsage = totalUsage + usage;
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
    setCapacityRates(capacitySet);
    setUsageDayHours(dayNightHoursCounter.day);
    setUsageNightHours(dayNightHoursCounter.night);
    setTotalMonthPrice(totalMonthPrice);
    setUsageData(dataForHour);
    setAvgMonthly(tempMonthAvg / hoursCounter);
    setGovSupport(createGovSupport(tempMonthAvg / hoursCounter));
    setTotalKwh(totalUsage);
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <>
        <Loading isLoading={isLoading} />
      </>
    );
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
                setSurcharge={setSurcharge}
                fee={fee}
                setFee={setFee}
                parseCsvJson={parseCsvJson}
                fixedPrice={fixedPrice}
                hasFixedPrice={hasFixedPrice}
                checkboxRef={checkboxRef}
                setHasFixedPrice={setHasFixedPrice}
                fixComma={fixComma}
                networkNightOrWeekendtPrice={networkNightOrWeekendtPrice}
                setNetworkNightOrWeekendtPrice={setNetworkNightOrWeekendtPrice}
                networkDayPrice={networkDayPrice}
                setNetworkDayPrice={setNetworkDayPrice}
                capacityPrice={capacityPrice}
                setCapacityPrice={setCapacityPrice}
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
                networkDayPrice={networkDayPrice}
                networkNightOrWeekendtPrice={networkNightOrWeekendtPrice}
                UsageDayHours={usageDayHours}
                UsageNightHours={usageNightHours}
                capacityPrice={capacityPrice}
                setCapacityPrice={setCapacityPrice}
              />
            )}

            <button
              className="reset-btn calculate-after w-25 align-self-center btn btn-danger ms-5 my-3"
              onClick={() => {
                window.location.reload();
              }}
            >
              Ny regning
            </button>
            <div className="results-d-flex">
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
        </div>
      </>
    );
  }
}

export default Home;
