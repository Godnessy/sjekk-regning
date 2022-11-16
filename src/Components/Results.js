import { React, useEffect } from "react";
import { Card } from "react-bootstrap";

function Results({
  totalMonthPrice,
  fee,
  totalUsage,
  month,
  surcharge,
  selectedMonth,
  hasFixedPrice,
  fixedPrice,
  selectedKommune,
}) {
  const zone = selectedKommune.value;
  return (
    <Card className="mx-4">
      <div className="d-flex align-content-left flex-column">
        <h2 className="text-decoration-underline p-2">
          Forventet regning for {month}
        </h2>
        <h2 className="ps-2">Total forbruk: {totalUsage.toFixed(0)} kWh</h2>
        <h3 className="ps-2">Sone: {zone}</h3>
        {hasFixedPrice && (
          <h3 className="ps-2">Fast pris pr kwh: {fixedPrice}</h3>
        )}
        <h3></h3>
        <hr />
        {surcharge && surcharge !== 0 ? (
          <h2 className="ps-2">
            Total påslag for {selectedMonth}:{" "}
            {((Number(surcharge) * totalUsage) / 100).toFixed(2)} kr{" "}
          </h2>
        ) : (
          <div></div>
        )}
        {fee !== 0 && <h2 className="ps-2">Månedspris : {fee} kr</h2>}
        {!hasFixedPrice && (
          <h2 className="ps-2">
            Din kWh snittpris :{" "}
            {((totalMonthPrice / totalUsage) * 100).toFixed(2)} øre pr kwh
          </h2>
        )}
        {hasFixedPrice && (
          <>
            <hr />
            <table className="tg">
              <thead>
                <tr>
                  <th className="tg-0lax left-side-table">Forbruk</th>
                  <th className="tg-0lax middle-table">x</th>
                  <th className="tg-0lax right-side-table">Fast pris</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tg-0lax left-side-table">
                    {totalUsage.toFixed(2)}
                  </td>
                  <td className="tg-0lax middle-table">x</td>
                  <td className="tg-0lax right-side-table">
                    {Number(fixedPrice)} Øre =
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        <h2 className="mt-3 mx-1 total-price">
          Å betale for {month}:{" "}
          {(Number(totalMonthPrice) + Number(fee)).toFixed(2)} kr
        </h2>
        <div className="price-exp mx-2 align-self-center">
          {!hasFixedPrice && (
            <p className="mx-2 align-self-center">
              Total månedspris beregnes utifra ditt forbruk for hver enkelt time
              og ikke månedsgjennomsnitt.
            </p>
          )}
          <hr />
          <p className="mx-2 align-self-center mt-2">
            <mark>
              Fant du en betydelig forskjell mellom våre beregninger og din
              regning?
            </mark>
            Vi anbefaler deg å ta kontakt med Ole Nyborg Markussen på{" "}
            <a href="http://https://www.facebook.com/groups/1055189454988378">
              {" "}
              Prismatch Strøm
            </a>{" "}
            som hjelper folk med denne typen problemer - gratis.
          </p>
        </div>
      </div>
    </Card>
  );
}

export default Results;
