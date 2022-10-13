import "./App.css";
import React, { useState, useEffect } from "react";
import Papa, { parse } from "papaparse";
import { db } from "./firebase-config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import AddDayToDB from "./Components/AddDayToDB";
import kommunes from "./Resources/kommuneList.json";
import KommuneDropdown from "./Components/KommuneDropdown";
import prices from "./Resources/price_json/september.json";
import AddMonthToDB from "./Components/AddMonthToDB";

/*TODO
Backend:
- Get a list of all the kommunes and add them to the DB with the area code for each. - 
- Every day import data from API 
- Parse the data into this format:
- Check which month this data is for then add it:
Day:
Hour: Price
Day: 
Hour: Price

- POST into the correct month, if the month does not exist create it.

Frontend:
- Get CSV from client --
- Parse the CSV into a format that I can work with 
 - create a search of all kommunes and return an area code, save that area code to a var -- 
- GET the relevant month out of the DB
- Cross the info from the parsed CSV and the DB 
- Calculate price for every hour of every day and save the results into a new object
- Display the output into the UI with the design made earlier
- Add a "send til Epost med PDF" and "Download PDF" button
-

*/
const allowedExtensions = ["csv"];

function App() {
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [monthList, setMonthList] = useState();
  const [usageData, setUsageData] = useState([]);
  const [priceData, setPriceData] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [kommuneList, setKommuneList] = useState(kommunes);
  const [selectedKommune, setSelectedKommune] = useState();
  const [totalMonthPrice, setTotalMonthPrice] = useState(0);

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
      const columns = parsedData;
      setUsageData(columns);
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
    const allPrices = prices[0];
    return allPrices[date];
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
      return zonePrices[time] / 10;
    } else {
      return 0;
    }
  };
  const createTotalPricePrHour = (date, time, usage, priceForHour) => {
    if (priceForHour) {
      const totalPrice = (priceForHour / 100) * Number(usage);
      tempMonthPrice = tempMonthPrice += totalPrice;
      return totalPrice;
    }
    return 0;
  };

  useEffect(() => {
    createMonthList();
  }, []);

  useEffect(() => {
    setTotalMonthPrice(`${tempMonthPrice.toFixed(2)} kr`);
  }, []);

  useEffect(() => {}, [selectedKommune]);

  return (
    <>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Upload usage CSV file
      </label>

      <input onChange={handleCsvFile} id="csvInput" name="file" type="File" />

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
      <div className="drop-down">
        <h4>Velg din kommune:</h4>
        <KommuneDropdown
          kommuneList={kommuneList}
          setSelectedKommune={setSelectedKommune}
        />
        {selectedKommune && (
          <h4> Din kommune tilhører sone: {selectedKommune.value}</h4>
        )}
      </div>
      <div>
        <AddMonthToDB />
      </div>

      <p>Total price for month: {totalMonthPrice}</p>
      <div className="usage-price-container">
        <div>
          {error
            ? error
            : usageData.map((col, idx) => {
                const titles = Object.keys(col);
                const values = Object.values(col);
                const date = values[0].split(" ")[0];
                const time = values[0].split(" ")[1];
                const usage = values[2].replace(",", ".");
                const dayPrices = collectDayPrices(prices, date);
                const selectedZonePrices = createSelectedPriceZone(
                  selectedKommune.value,
                  dayPrices
                );
                const priceForHour = createPriceForHour(
                  selectedZonePrices,
                  time
                );
                const totalPricePrHour = createTotalPricePrHour(
                  date,
                  time,
                  usage,
                  priceForHour
                );

                return (
                  <p
                    key={idx}
                  >{`On the ${date} at ${time} you used ${usage} Kwh, At a spot price of ${priceForHour.toFixed(
                    2
                  )} øre, this hour cost you: ${totalPricePrHour.toFixed(
                    2
                  )} nok`}</p>
                );
              })}
        </div>
      </div>
    </>
  );
}

export default App;
