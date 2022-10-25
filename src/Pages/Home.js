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
import prices from "../Resources/price_json/october.json";
import AddMonthToDB from "../Components/AddMonthToDB";
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
    let monthArr = [];
    for (let i = 0; i < currentMonth + 1; i++) {
      const m = date.getMonth();
      monthArr.push(monthNames[m]);
      date.setMonth(date.getMonth() - 1);
    }
    return setMonthList(monthArr);
  };

  const collectDayPrices = (prices, date) => {
    console.log(date, prices);
    return prices[date];
  };

  const createSelectedPriceZone = (selectedZone, priceObjForDay) => {
    if (priceObjForDay) {
      console.log(priceObjForDay);
      return priceObjForDay[selectedZone];
    } else {
      return "test";
    }
  };

  const createPriceForHour = (zonePrices, time) => {
    if (zonePrices) {
      const basePrice = Number(zonePrices[time]);
      const calculatedPrice = basePrice + Number(surcharge);
      console.log(basePrice, surcharge, calculatedPrice);
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
  }

  function renderHourlyInfo(dataForHour) {
    return dataForHour.map((day) => {
      const { date, time, usage, priceForHour, totalPricePrHour } = day;
      return (
        <p
          key={date + time}
        >{`On the ${date} at ${time} you used ${usage} Kwh, At a spot price of ${priceForHour.toFixed(
          2
        )} øre, this hour cost you: ${totalPricePrHour.toFixed(2)} nok`}</p>
      );
    });
  }

  return (
    <>
      <div>
        <div>
          <h6 className="w100 text-center mt-2">
            <Button className="" onClick={handleLogout}>
              Logg ut{" "}
            </Button>
          </h6>
        </div>
        <div className="inputs-container d-flex">
          <div>
            <label htmlFor="csvInput" style={{ display: "block" }}>
              Upload usage CSV file
            </label>

            <input
              onChange={handleCsvFile}
              id="csvInput"
              name="file"
              type="File"
            />

            <div>
              <button onClick={parseCsvJson}>Parse</button>
            </div>

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
                monthList.map((month) => (
                  <option key={month} value={month}>
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
          <p>Total price for month: {totalMonthPrice.toFixed(2)}</p>
        </div>
      </div>
      <div className="usage-price-container">
        <div>{renderHourlyInfo(usageData)}</div>
      </div>
    </>
  );
}

export default Home;
