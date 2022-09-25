import "./App.css";
import React, { useState } from "react";
import Papa, { parse } from "papaparse";

const allowedExtensions = ["csv"];

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");

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

  return (
    <>
      <label htmlFor="csvInput" style={{ display: "block" }}>
        Enter CSV File
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
                    <td> {values[0].split(" ")[0]}</td>
                    <td> {values[0].split(" ")[1]}</td>
                    <td>{values[2]}</td>
                  </tr>
                </tbody>
              </table>
            );
          })}
    </>
  );
}

export default App;
