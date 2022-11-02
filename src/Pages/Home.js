import { useState, useEffect, useRef } from "react";
import Papa, { parse } from "papaparse";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase-config.js";
import { useAuth } from "../context/AuthContext.js";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import AddDayToDB from "./Components/AddDayToDB";
import kommunes from "../Resources/kommuneList.json";
import KommuneDropdown from "../Components/KommuneDropdown";
import prices from "../Resources/price_json/October.json";
import AddMonthToDB from "../Components/AddMonthToDB";
import DailyPrices from "../Components/DailyPrices.js";
import HourlyPrices from "../Components/HourlyPrices.js";
import NetworkUsage from "../Components/NetworkUsage.js";
import Navbar from "../Components/Navbar.js";
import Instructions from "../Components/Instructions.js";
import Results from "../Components/Results.js";

const allowedExtensions = ["csv"];
function Home() {
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [monthList, setMonthList] = useState();
  const [usageData, setUsageData] = useState();
  const [priceData, setPriceData] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [kommuneList, setKommuneList] = useState(kommunes);
  const [selectedKommune, setSelectedKommune] = useState();
  const [totalMonthPrice, setTotalMonthPrice] = useState();
  const { currentUser, logout } = useAuth();
  const [surcharge, setsurcharge] = useState(0);
  const [fee, setFee] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState();
  const [govSupport, setGovSupport] = useState(0);
  const [myGovSupport, setMyGovSupport] = useState(0);
  const [networkDayPrice, setNetworkDayPrice] = useState(0);
  const [networkNightPrice, setNetworkNightPrice] = useState(0);
  const [dailyData, setDailyData] = useState();
  const [totalKwh, setTotalKwh] = useState();
  const [month, setMonth] = useState();
  const [avgPrice, setAvgPrice] = useState();

  const navigate = useNavigate();

  let tempMonthPrice = 0;
  let totalUsage = 0;
  let hoursCounter = 0;
  let tempAvg = 0;

  const handleCsvFile = (e) => {
    setError("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      setFile(inputFile);
    }
  };
  const parseCsvJson = () => {
    if (!selectedKommune) {
      setError(<h2>Velg kommune fra listen</h2>);
      return;
    }
    if (!file) return setError(<h2>Finner ikke CSV filen</h2>);
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
      const basePrice = priceForHour;
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
        tempAvg = tempAvg + priceForHour;
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
    setAvgPrice((totalUsage / tempAvg) * 10000);
  }

  // useEffect(() => {
  //   console.log(avgPrice);
  // }, [avgPrice]);

  if (!usageData) {
    return (
      <>
        <Navbar logOut={handleLogout} />
        <div className="d-flex justify-content-center my-5">
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
              {/* Month selector to be implemented later when functionality works */}
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
              {/* Month selector to be implemented later when functionality works */}
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
            {totalMonthPrice && (
              <Results
                totalMonthPrice={totalMonthPrice}
                fee={fee}
                totalUsage={totalKwh}
                month={selectedMonth}
                avgPrice={avgPrice}
              />
            )}
          </div>
        </div>

        <div className="usage-price-container my-2 d-flex">
          <div className="ms-3">
            {usageData && (
              <HourlyPrices
                dataForHour={usageData}
                setAvgPrice={setAvgPrice}
                hoursCounter={hoursCounter}
              />
            )}
          </div>
          <div className="me-4">
            {usageData && (
              <DailyPrices
                dataForHour={usageData}
                totalMonthPrice={totalMonthPrice}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Home;
