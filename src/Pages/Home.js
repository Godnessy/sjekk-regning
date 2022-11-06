import { useState, useEffect, useRef } from "react";
import Papa, { parse } from "papaparse";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config.js";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.js";
import kommunes from "../Resources/kommuneList.json";
import KommuneDropdown from "../Components/KommuneDropdown";
import DailyPrices from "../Components/DailyPrices.js";
import HourlyPrices from "../Components/HourlyPrices.js";
import Navbar from "../Components/Navbar.js";
import Instructions from "../Components/Instructions.js";
import Results from "../Components/Results.js";
import InputsForm from "../Components/InputsForm.js";
const allowedExtensions = ["csv"];

function Home() {
  const [error, setError] = useState("");
  const [prices, setPrices] = useState({});
  const [file, setFile] = useState("");
  const [monthList, setMonthList] = useState();
  const [usageData, setUsageData] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [kommuneList, setKommuneList] = useState(kommunes);
  const [selectedKommune, setSelectedKommune] = useState();
  const [totalMonthPrice, setTotalMonthPrice] = useState();
  const { currentUser, logout } = useAuth();
  const [surcharge, setsurcharge] = useState(0);
  const [fee, setFee] = useState(0);
  const [govSupport, setGovSupport] = useState(0);
  const [myGovSupport, setMyGovSupport] = useState(0);
  const [networkDayPrice, setNetworkDayPrice] = useState(0);
  const [networkNightPrice, setNetworkNightPrice] = useState(0);
  const [totalKwh, setTotalKwh] = useState();
  const [avgPrice, setAvgPrice] = useState();
  const [fixedPrice, setFixedPrice] = useState(0);
  const [hasFixedPrice, setHasFixedPrice] = useState(false);
  const checkboxRef = useRef();

  const navigate = useNavigate();

  let tempMonthPrice = 0;
  let totalUsage = 0;
  let hoursCounter = 0;
  let avgPriceTimesUsage = 0;

  const getMonthPrices = async (month) => {
    const monthRef = doc(db, "price-history", `${month}-22`);
    const docSnap = await getDoc(monthRef);
    if (docSnap.exists()) {
      setPrices(docSnap.data());
      console.log(`Selected ${month}`);
    } else {
      console.log("Doc does not exist");
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
    else if (!selectedMonth) return setError("Husk å velg måned");
    else if (!selectedKommune) return setError("Velg kommune fra listen");
    setError("");
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const organizedDataFormat = parsedData;
      calculateMonthlyValues(organizedDataFormat);
    };
    reader.readAsText(file);
  };

  const createMonthList = () => {
    const date = new Date();
    const months = 12;
    const currentMonth = date.getMonth();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let monthArr = new Set();
    for (let i = 0; i < currentMonth + 1; i++) {
      const m = date.getMonth();
      monthArr.add(monthNames[m]);
      date.setMonth(date.getMonth() - 1);
    }
    return setMonthList(Array.from(monthArr));
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

  useEffect(() => {
    createMonthList();
  }, []);

  useEffect(() => {}, [selectedKommune]);
  useEffect(() => {}, [totalMonthPrice]);

  async function handleLogout(usageData) {
    setError("");
    try {
      await logout();
      navigate("/");
    } catch (error) {
      setError("Failed to logout");
    }
  }

  function calculateAveragePrice(avgPriceTimesUsage, totalHours) {
    return avgPriceTimesUsage / totalHours;
  }

  function calculateMonthlyValues(usageData) {
    let hourCounter = 0;
    const dataForHour = usageData.map((col, idx) => {
      const values = Object.values(col);
      const date = values[0].split(" ")[0];
      const time = values[0].split(" ")[1];
      const usage = values[2].replace(",", ".");
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
    const totalMonthPrice = dataForHour.reduce((result, item) => {
      return result + item.totalPricePrHour;
    }, 0);
    setTotalMonthPrice(totalMonthPrice);
    setUsageData(dataForHour);
    setTotalKwh(totalUsage);
    setAvgPrice(calculateAveragePrice(avgPriceTimesUsage, hoursCounter));
  }

  useEffect(() => {
    getMonthPrices(selectedMonth);
  }, [selectedMonth]);

  if (!usageData) {
    return (
      <>
        <Navbar logOut={handleLogout} />
        <div className="d-flex justify-content-center my-5">
          <InputsForm
            handleCsvFile={handleCsvFile}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            monthList={monthList}
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
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <Navbar logOut={handleLogout} />

        <div className="page-container">
          <div className="inputs-container justify-content-center my-2 d-flex">
            <div className="ms-3 border border-dark p-3 card">
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
              <label htmlFor="months">
                <h3>2. Velg måned:</h3>{" "}
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
                {error && <p className="text-danger d-flex ">{error} </p>}
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
                  {hasFixedPrice && <h3>Fast kwh pris: {fixedPrice} Øre</h3>}
                </div>
                <div className="calculate-btn">
                  {totalMonthPrice ? (
                    <button
                      className="calculate btn btn-danger ms-5 my-3"
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
            </div>
            {totalMonthPrice && (
              <Results
                totalMonthPrice={totalMonthPrice}
                fee={fee}
                totalUsage={totalKwh}
                month={selectedMonth}
                avgPrice={avgPrice}
                surcharge={surcharge}
                selectedMonth={selectedMonth}
                hasFixedPrice={hasFixedPrice}
                fixedPrice={fixedPrice}
              />
            )}
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
      </>
    );
  }
}

export default Home;
