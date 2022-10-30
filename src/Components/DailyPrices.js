import { React, useState, useEffect } from "react";

function DailyPrices({ dataForHour }) {
  const [dailyData, setDailyData] = useState([]);

  function calculateDailyValues(dataForHour) {
    let dailyData = [];
    let dailyDataObj = {};
    let prevUsage = 0;
    let prevPrice = 0;
    for (let hour of dataForHour) {
      let { date, usage, totalPricePrHour } = hour;
      usage = Number(usage);
      if (!dailyDataObj[date]) {
        dailyDataObj[date] = {
          totalUsage: usage,
          totalPrice: totalPricePrHour,
        };
      } else {
        dailyDataObj[date] = {
          totalUsage: prevUsage + usage,
          totalPrice: prevPrice + totalPricePrHour,
        };
      }
      prevUsage = dailyDataObj[date].totalUsage;
      prevPrice = dailyDataObj[date].totalPrice;
    }

    setDailyData(dailyDataObj);
  }

  useEffect(() => {
    calculateDailyValues(dataForHour);
  }, [dataForHour]);

  return (
    <div>
      <h2>Bruk og kostnad pr day</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Dato</th>
            <th scope="col">kwh Brukt</th>
            <th scope="col">Pris for dagen</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dailyData).map((day) => {
            const date = day[0];
            const totalUsage = day[1].totalUsage.toFixed(2);
            const totalPrice = day[1].totalPrice.toFixed(2);
            return (
              <tr key={date}>
                <th scope="row">{date}</th>
                <td>{totalUsage}</td>
                <td>{totalPrice}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DailyPrices;
