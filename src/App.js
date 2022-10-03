import "./App.css";
import React, { useState, useEffect } from "react";
import Papa, { parse } from "papaparse";
import db from "./firebase-config";
import prices from "./augustJSON.json";

/*TODO
Backend:
- Every day import data from API 
- Parse the data into this format:
Check which month this data is for then add it:
Day:
Hour: Price
Day: 
Hour: Price

-POST into the correct month, if the month does not exist create it.

Frontend:
- Get CSV from client -
- Parse the CSV into a format that I can work with
- GET the relevant month out of the DB
- Cross the info from the parsed CSV and the DB 
- Calculate price for every hour of every day and save the results into a new object
- Display the output into the UI with the design made earlier
- Add a "send til Epost med PDF" and "Download PDF" button
-

*/
const allowedExtensions = ["csv"];

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [monthList, setMonthList] = useState();
  const [usageData, setUsageData] = useState();
  const [priceData, setPriceData] = useState(prices);
  const [selectedMonth, setSelectedMonth] = useState();

  const handleFileChange = (e) => {
    setError("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      setFile(inputFile);
      console.log(`input file set`);
    }
  };
  const handleParse = () => {
    if (!file) return setError("Enter a valid file");
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const columns = parsedData;
      setData(columns);
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

  useEffect(() => {
    createMonthList();
  }, []);

  return (
    <>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Upload usage CSV file
      </label>

      <input
        onChange={handleFileChange}
        id="csvInput"
        name="file"
        type="File"
      />

      <div>
        <button onClick={handleParse}>Parse</button>
      </div>

      <label htmlfor="months"> Choose a month: </label>
      <select
        name="months"
        id="months"
        value={selectedMonth}
        onChange={(e) => {
          setSelectedMonth(e.target.value);
          console.log(e.target.value);
        }}
      >
        <option value=""> Valg en måned </option>
        {monthList &&
          monthList.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
      </select>
      {error
        ? error
        : data.map((col, idx) => {
            const titles = Object.keys(col);
            const values = Object.values(col);
            return (
              <table>
                <thead>
                  <tr>
                    <th>Dato</th>
                    <th>Klokke</th>
                    <th>Kwt brukt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> {values[0].split[0]}</td>
                    <td> {values[0].split[1]}</td>
                    <td>{values[2]}</td>
                  </tr>
                </tbody>
              </table>
            );
          })}

      <div>{prices && prices.map((hour) => {})}</div>
    </>
  );
}

export default App;
