import React from "react";
import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
// import pricesInfo from "../Resources/price_history/07-10-22.json";

// const cityRef = doc(db, 'cities', 'BJ');
// setDoc(cityRef, { capital: true }, { merge: true });

function AddDayToDB({ setPriceData, selectedZone }) {
  const [prices, setPrices] = useState();
  const [pricesInfo, setPricesInfo] = useState();

  const date = pricesInfo.date.split("-").reverse().join(".");
  const hours = pricesInfo.priceByHour.hours;
  const zones = {
    oslo: "NO1",
    kristiansand: "NO2",
    molde: "NO3",
    trondheim: "NO3",
    tromso: "NO4",
    bergen: "NO5",
  };
  const finishedPriceList = {};
  const hourlyPrices = pricesInfo.priceByHour.pricesObj;

  useEffect(() => {
    Object.entries(hourlyPrices).forEach((zone) => {
      const name = zone[0];
      if (name == "molde") {
        return;
      } else {
        const pricesArr = zone[1];
        const prices = {};
        for (let i = 0; i < pricesArr.length; i++) {
          const hour = `${hours[i].split("-")[0]}:00`;
          const basePrice = pricesArr[i];
          const price = basePrice * 1.25;
          const priceUnit = { [hour]: Number(price) };
          Object.assign(prices, priceUnit);
        }
        const currentZone = zones[name];
        const newPricesObj = { [currentZone]: prices };
        Object.assign(finishedPriceList, newPricesObj);
      }
      setPrices([{ [date]: finishedPriceList }]);
      setPriceData([{ [date]: finishedPriceList }]);
    });
  }, []);

  return (
    <div className="zones-container">
      {prices &&
        Object.entries(prices[0][date]).map((zone) => {
          const area = zone[0];
          const prices = Object.entries(zone[1]).sort();
          if (selectedZone == area) {
            return (
              <div>
                <h4>{area}</h4>
                <h4>{date}</h4>
                {prices.map((hour) => {
                  const time = hour[0];
                  const price = hour[1];
                  return (
                    <p key={time}>
                      Kl {time} : {price.toFixed(2)} øre
                    </p>
                  );
                })}
              </div>
            );
          } else {
            return;
          }
        })}
    </div>
  );
}

export default AddDayToDB;
