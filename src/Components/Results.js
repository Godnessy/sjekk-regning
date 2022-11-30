import { React, useState, useEffect } from "react";
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
  govSupport,
  lastDay,
  zone,
}) {
  const [isSupport, setIsSupport] = useState(false);
  const clientGovSupport = totalUsage * govSupport;

  useEffect(() => {
    avgPrice > 70 ? setIsSupport(true) : setIsSupport(false);
  }, [avgPrice]);

  const createGovSupportDiv = (totalUsage, govSupport) => {
    if (avgPrice > 70) {
      return (
        <h3 className="ps-2">
          Din strømstøtte: {((totalUsage * govSupport) / 100).toFixed(2)} kr
        </h3>
      );
    } else {
      return "";
    }
  };
  return (
    <Card className="mx-4">
      <div className="d-flex align-content-left flex-column">
        <h2 className="text-decoration-underline p-2">
          Forventet regning for {month}
        </h2>
        <h2 className="ps-2 my-1">
          Total forbruk: {totalUsage.toFixed(0)} kWh
        </h2>
        <h3 className="ps-2 my-1">
          Snitt pris for {zone}: {avgPrice.toFixed(2)} øre pr kwh
        </h3>
        {!hasFixedPrice && (
          <h3 className="ps-2 my-1">
            Strømstøtte {lastDay}:{" "}
            {avgPrice > 70 ? (
              <p className="support"> {govSupport.toFixed(2)} øre pr kwh</p>
            ) : (
              <p>Ingen strømstøtte</p>
            )}
          </h3>
        )}
        <hr />
        {surcharge && surcharge !== 0 ? (
          <h2 className="ps-2">
            Total påslag for {selectedMonth}:{" "}
            {((Number(surcharge) * totalUsage) / 100).toFixed(2)} kr{" "}
          </h2>
        ) : (
          <div></div>
        )}
        {!hasFixedPrice ? (
          createGovSupportDiv(totalUsage, govSupport)
        ) : (
          <h3>Strømstøtte for fastpris kommer snart!</h3>
        )}

        {fee !== 0 && <h2 className="ps-2">Månedspris : {fee} kr</h2>}
        {!hasFixedPrice && (
          <h2 className="ps-2">
            Din snittpris : {((totalMonthPrice / totalUsage) * 100).toFixed(2)}{" "}
            øre pr kwh
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
          {(Number(totalMonthPrice) - govSupport + Number(fee)).toFixed(2)} kr
        </h2>
        <div className="price-exp mx-2 align-self-center">
          {!hasFixedPrice && (
            <p className="mx-2 align-self-center">
              Total månedspris beregnes utifra ditt forbruk for hver enkelt time
              og ikke månedsgjennomsnitt.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default Results;
