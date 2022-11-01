import React from "react";
import { Card } from "react-bootstrap";

function Results({ totalMonthPrice, fee, totalUsage, month }) {
  console.log(totalUsage);
  return (
    <Card className="mx-4">
      <div className="d-flex align-content-left flex-column">
        <h2 className="text-decoration-underline p-2">
          Forventet regning for {month}
        </h2>
        <h2>Total forbruk: {totalUsage.toFixed(0)} Kwt</h2>
        <h2>Månedspris : {fee}</h2>
        <h2 className="m-5" bg={"info"}>
          Total pris: {(Number(totalMonthPrice) + Number(fee)).toFixed(2)}
        </h2>
      </div>
    </Card>
  );
}

export default Results;
