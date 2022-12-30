import { React, useState, useEffect } from "react";

function DailyPrices({ dataForHour, hasFixedPrice, fixedPrice, govSupport }) {
  const [dailyData, setDailyData] = useState([]);

  function calculateDailyValues(dataForHour) {
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
    <div className="card daily-prices p-2 vh-10">
      <h2 className="text-decoration-underline">
        Forbruk og kostnad pr dag - strøm
      </h2>
      <table className="table daily-table table-striped">
        <thead>
          <tr>
            <th scope="col" className="table-headers">
              Dato
            </th>
            <th scope="col" className="table-headers">
              Forbruk kWh
            </th>
            <th scope="col" className="table-headers">
              Pris for dagen
            </th>
            <th scope="col" className="table-headers">
              Pris ink strømstøtte
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dailyData).map((day) => {
            const date = day[0];
            const totalUsage = day[1].totalUsage.toFixed(2);
            const totalPrice = day[1].totalPrice.toFixed(2);
            const totalWithGovSupport =
              totalPrice - (totalUsage * govSupport) / 100;
            return (
              <tr key={date}>
                <th scope="row">{date}</th>
                <td>{totalUsage}</td>
                <td>{totalPrice} kr</td>
                <td className={totalWithGovSupport < 0 ? "minus-price" : ""}>
                  {totalWithGovSupport.toFixed(2)} kr
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DailyPrices;
