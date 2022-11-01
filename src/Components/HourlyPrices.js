import React from "react";

function HourlyPrices({ dataForHour }) {
  return (
    <div className="card p-2">
      <h2 className="text-decoration-underline">
        Detaljerte time for time beregninger
      </h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Dato</th>
            <th scope="col">Time</th>
            <th scope="col">Kwt brukt</th>
            <th scope="col">Pris pr Time</th>
            <th scope="col">Total pris</th>
          </tr>
        </thead>
        <tbody>
          {dataForHour.map((day) => {
            const { date, time, usage, priceForHour, totalPricePrHour } = day;
            return (
              <tr key={date + time}>
                <th scope="row">{date}</th>
                <td>{time}</td>
                <td>{usage}</td>
                <td>{priceForHour.toFixed(2)} Øre</td>
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
