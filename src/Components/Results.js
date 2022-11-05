import React from "react";
import { Card } from "react-bootstrap";

function Results({
  totalMonthPrice,
  fee,
  totalUsage,
  month,
  avgPrice,
  surcharge,
  selectedMonth,
  hasFixedPrice,
  fixedPrice,
}) {
  return (
    <Card className="mx-4">
      <div className="d-flex align-content-left flex-column">
        <h2 className="text-decoration-underline p-2">
          Forventet regning for {month}
        </h2>
        <h2 className="ps-2">Total forbruk: {totalUsage.toFixed(0)} kWh</h2>
        <hr />
        {surcharge && surcharge !== 0 ? (
          <h2 className="ps-2">
            Total påslag for {selectedMonth}:{" "}
            {((Number(surcharge) * totalUsage) / 100).toFixed(2)} kr{" "}
          </h2>
        ) : (
          <div></div>
        )}
        {fee !== 0 && <h2 className="ps-2">Månedspris : {fee}</h2>}
        <h2 className="ps-2">Din kWh snittpris : {avgPrice.toFixed(2)} øre</h2>
        <hr />
        {hasFixedPrice && (
          <table class="tg">
            <thead>
              <tr>
                <th class="tg-0lax left-side-table">Forbruk</th>
                <th class="tg-0lax middle-table">x</th>
                <th class="tg-0lax right-side-table">Fast pris</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tg-0lax left-side-table">{totalUsage.toFixed(2)}</td>
                <td class="tg-0lax middle-table">x</td>
                <td class="tg-0lax right-side-table">
                  {Number(fixedPrice)} Øre =
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <h2 className="m-5 total-price">
          Å betale for {month}:{" "}
          {(Number(totalMonthPrice) + Number(fee)).toFixed(2)} kr
        </h2>
      </div>
    </Card>
  );
}

export default Results;
