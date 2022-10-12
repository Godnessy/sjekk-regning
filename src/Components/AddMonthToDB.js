import React, { useEffect } from "react";
import septemberPrices from "../Resources/price_history/all_prices_september.json";
import AddDayToDB from "./AddDayToDB";

function AddMonthToDB() {
  const monthPricesArr = [];

  const monthPrices = {};
  const createMonthPricesObj = () => {
    septemberPrices.forEach((hour) => {
      const { Dato, Time, NO1Price, NO2Price, NO3Price, NO4Price, NO5Price } =
        hour;
      let currentHour = `${Time.split("-")[0].slice(0, 2)}:00`;

      if (!monthPrices[Dato]) {
        monthPrices[Dato] = { NO1: {}, NO2: {}, NO3: {}, NO4: {}, NO5: {} };
      } else if (currentHour == "00:00") {
        monthPrices[Dato].NO1["00:00"] = Number(NO1Price);
        monthPrices[Dato].NO2["00:00"] = Number(NO2Price);
        monthPrices[Dato].NO3["00:00"] = Number(NO3Price);
        monthPrices[Dato].NO4["00:00"] = Number(NO4Price);
        monthPrices[Dato].NO5["00:00"] = Number(NO5Price);
      } else {
        // monthPrices[Dato].NO1[currentHour] = Number(NO1Price);
        // monthPrices[Dato].NO2[currentHour] = Number(NO2Price);
        // monthPrices[Dato].NO3[currentHour] = Number(NO3Price);
        // monthPrices[Dato].NO4[currentHour] = Number(NO4Price);
        // monthPrices[Dato].NO5[currentHour] = Number(NO5Price);
      }
    });
    monthPricesArr.push(monthPrices);
    console.log(monthPricesArr);
  };

  useEffect(() => {
    createMonthPricesObj();
  }, []);

  return <div>AddMonthToDB</div>;
}

export default AddMonthToDB;
