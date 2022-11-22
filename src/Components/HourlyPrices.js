import React from "react";

function HourlyPrices({ dataForHour, hasFixedPrice, fixedPrice }) {
  let totalPrice = 0;
  return (
    <div className="card p-2">
      <h2 className="text-decoration-underline">
        Detaljerte time for time beregninger
      </h2>
      <table className="table table-hourly table-striped">
        <thead>
          <tr>
            <th scope="col">Dato</th>
            <th scope="col">Time</th>
            <th scope="col">Forbruk kWh</th>
            <th scope="col">kWh pris</th>
            <th scope="col">Total pris</th>
          </tr>
        </thead>
        <tbody>
          {dataForHour.map((day) => {
            let { date, time, usage, priceForHour, totalPricePrHour } = day;
            priceForHour = hasFixedPrice ? fixedPrice : priceForHour;
            totalPrice = totalPrice + Number(priceForHour);
            return (
              <tr key={date + time}>
                <th scope="row">{date}</th>
                <td>{time}</td>
                <td>{usage}</td>
                <td>
                  {hasFixedPrice ? priceForHour : priceForHour.toFixed(2)} Øre
                </td>
                <td>{`${totalPricePrHour.toFixed(2)} nok`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HourlyPrices;
