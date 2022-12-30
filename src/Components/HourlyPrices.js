import React from "react";

function HourlyPrices({ dataForHour, hasFixedPrice, fixedPrice, govSupport }) {
  let totalPrice = 0;
  return (
    <div className="card p-2">
      <h2 className="text-decoration-underline">
        Detaljerte time for time beregninger - strøm
      </h2>
      <table className="table table-hourly table-striped">
        <thead>
          <tr>
            <th scope="col" className="table-headers">
              Dato
            </th>
            <th scope="col" className="table-headers">
              Time
            </th>
            <th scope="col" className="table-headers">
              Forbruk kWh
            </th>
            <th scope="col" className="table-headers">
              kWh pris
            </th>
            <th scope="col" className="table-headers">
              Time pris
            </th>
            <th scope="col" className="table-headers">
              Time pris ink støtte
            </th>
          </tr>
        </thead>
        <tbody>
          {dataForHour.map((day) => {
            let { date, time, usage, priceForHour, totalPricePrHour } = day;
            priceForHour = hasFixedPrice ? fixedPrice : priceForHour;
            totalPrice = totalPrice + Number(priceForHour);
            const supportForHour = (usage * govSupport) / 100;
            const hourlyPriceWithSupport = totalPricePrHour - supportForHour;
            return (
              <tr key={date + time}>
                <th scope="row">{date}</th>
                <td>{time}</td>
                <td>{usage}</td>
                <td>
                  {hasFixedPrice ? priceForHour : priceForHour.toFixed(2)} Øre
                </td>
                <td>{`${totalPricePrHour.toFixed(2)} nok`}</td>
                <td
                  className={hourlyPriceWithSupport < 0 ? "minus-price" : ""}
                >{`${hourlyPriceWithSupport.toFixed(2)} nok`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HourlyPrices;
