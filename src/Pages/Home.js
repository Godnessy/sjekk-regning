import { useState, useEffect, useRef } from "react";
import Papa, { parse } from "papaparse";
import { Button } from "react-bootstrap";
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

const allowedExtensions = ["csv"];
function Home() {
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [monthList, setMonthList] = useState();
  const [usageData, setUsageData] = useState([]);
  const [priceData, setPriceData] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [kommuneList, setKommuneList] = useState(kommunes);
  const [selectedKommune, setSelectedKommune] = useState();
  const [totalMonthPrice, setTotalMonthPrice] = useState(0);
  const { currentUser, logout } = useAuth();
  const [surcharge, setsurcharge] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState();
  const [govSupport, setGovSupport] = useState(0);
  const [myGovSupport, setMyGovSupport] = useState(0);
  const [networkDayPrice, setNetworkDayPrice] = useState(0);
  const [networkNightPrice, setNetworkNightPrice] = useState(0);
  const [dailyData, setDailyData] = useState();

  const navigate = useNavigate();

  let tempMonthPrice = 0;

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
      setError("Please Select a kommune before clicking this button!");
      return;
    }
    if (!file) return setError("Enter a valid file");
    setError();
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
    let averagePriceforZone = 0;
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
      const priceForHour = createPriceForHour(selectedZonePrices, time);
      const totalPricePrHour = createTotalPricePrHour(usage, priceForHour);
      hourCounter++;
      const dayAveragePrice = Object.values(selectedZonePrices).reduce(
        (result, price) => {
          if (isNaN(price)) {
            return;
          } else {
            return (result + price / 100) / hourCounter;
          }
        },
        0
      );

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
    setMonthlyAverage((totalMonthPrice / hourCounter).toFixed(2));
    setTotalMonthPrice(totalMonthPrice);
    setUsageData(dataForHour);
  }

  // function renderHourlyInfo(dataForHour) {
  //   return (
  //     <div>
  //       <h2>Time for time</h2>
  //       <table className="table table-striped">
  //         <thead>
  //           <tr>
  //             <th scope="col">Dato</th>
  //             <th scope="col">Time</th>
  //             <th scope="col">Kwt brukt</th>
  //             <th scope="col">Pris pr Time</th>
  //             <th scope="col">Total pris</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {dataForHour.map((day) => {
  //             const { date, time, usage, priceForHour, totalPricePrHour } = day;
  //             return (
  //               <tr key={date + time}>
  //                 <th scope="row">{date}</th>
  //                 <td>{time}</td>
  //                 <td>{usage}</td>
  //                 <td>{priceForHour.toFixed(2)} Øre</td>
  //                 <td>{`${totalPricePrHour.toFixed(2)} nok`}</td>
  //               </tr>
  //             );
  //           })}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // }

  return (
    <>
      <div>
        <div>
          <h6 className="w100 text-center mt-2">
            <Button className="" onClick={handleLogout}>
              Logg ut
            </Button>
          </h6>
        </div>
        <div className="inputs-container d-flex">
          <div className="ms-3 border border-dark p-3">
            <label htmlFor="csvInput" style={{ display: "block" }}>
              Upload usage CSV file
            </label>

            <input
              onChange={handleCsvFile}
              id="csvInput"
              name="file"
              type="File"
            />

            <label htmlFor="months"> Choose a month: </label>
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
            <div className="drop-down d-flex">
              <h4 className="me-3">Velg din kommune:</h4>
              <div className="w-5">
                <KommuneDropdown
                  kommuneList={kommuneList}
                  setSelectedKommune={setSelectedKommune}
                />
                {selectedKommune && (
                  <h4> Din kommune tilhører sone: {selectedKommune.value}</h4>
                )}
              </div>
            </div>
            <div className="surcharge d-flex">
              <h3 className="me-2">Påslag</h3>
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
          </div>
          <div className="d-flex flex-column">
            <h2 className="m-5 ">Total pris: {totalMonthPrice.toFixed(2)}</h2>
            <p className="m-5">
              {monthlyAverage && ` Måned snittpris: ${monthlyAverage}`}
            </p>
            <p className="m-5">Strømstøtte på snittpris:</p>
            <p className="m-5">Din strømstøtte:</p>
          </div>
          <div className="">
            <h2>Nettleie</h2>
            <h4>Kommer Snart!</h4>
            {/* <div>
              <p>Dag pris</p>
              <input
                className="network-charge-input"
                type="text"
                value={networkDayPrice}
                onChange={(e) => {
                  setNetworkDayPrice(e.target.value);
                }}
              />
              Øre
            </div>
            <div>
              <p>Natt pris</p>
              <input
                className="network-charge-input"
                type="text"
                value={networkNightPrice}
                onChange={(e) => {
                  setNetworkNightPrice(e.target.value);
                }}
                />
              Øre
            </div> */}
          </div>
        </div>
      </div>
      <div>
        <button onClick={parseCsvJson} className="ms-5 my-3">
          Regne ut!
        </button>
      </div>
      <div className="usage-price-container d-flex">
        <HourlyPrices dataForHour={usageData} />
        <DailyPrices dataForHour={usageData} />
      </div>
    </>
  );
}

export default Home;
