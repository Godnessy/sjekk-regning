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
}) {
  return (
    <Card className="mx-4">
      <div className="d-flex align-content-left flex-column">
        <h2 className="text-decoration-underline p-2">
          Forventet regning for {month}
        </h2>
        <h2 className="ps-2">Total forbruk: {totalUsage.toFixed(0)} kWh</h2>
        <hr />
        {surcharge && surcharge !== 0 && (
          <h2 className="ps-2">
            Total påslag for {selectedMonth}:{" "}
            {((Number(surcharge) * totalUsage) / 100).toFixed(2)} kr{" "}
          </h2>
        )}
        {fee !== 0 && <h2 className="ps-2">Månedspris : {fee}</h2>}
        <h2 className="ps-2">Din kWh snittpris : {avgPrice.toFixed(2)} øre</h2>
        <hr />
        <h2 className="m-5 total-price">
          Å betale for {month}:{" "}
          {(Number(totalMonthPrice) + Number(fee)).toFixed(2)} kr
        </h2>
      </div>
    </Card>
  );
}

export default Results;
