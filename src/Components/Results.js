import { React, useState, useEffect, useRef } from "react";
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
  isGovSupport,
  lastDay,
  zone,
  networkDayPrice,
  networkNightOrWeekendtPrice,
  UsageDayHours,
  UsageNightHours,
  capacityPrice,
}) {
  const [isSupport, setIsSupport] = useState(false);
  const [finalDayRate, setFinalDayRate] = useState(0);
  const [finalNightRate, setFinalNightRate] = useState(0);

  const totalUsagedisplay = totalUsage && totalUsage.toFixed(2);

  useEffect(() => {
    setNetworkRates(
      networkDayPrice,
      networkNightOrWeekendtPrice,
      UsageDayHours,
      UsageNightHours
    );
  }, [totalMonthPrice]);
  const calculateGovSupport = () => {
    return (totalUsage * govSupport) / 100;
  };

  const getPersonalGovSupport = (isGovSupport) => {
    return isGovSupport ? calculateGovSupport() : 0;
  };

  const setNetworkRates = (
    networkDayPrice,
    networkNightOrWeekendtPrice,
    UsageDayHours,
    UsageNightHours
  ) => {
    const { finalDayRate, finalNightRate } = calculateNetworkRates(
      networkDayPrice,
      networkNightOrWeekendtPrice,
      UsageDayHours,
      UsageNightHours
    );
    setFinalDayRate(finalDayRate);
    setFinalNightRate(finalNightRate);
  };

  const calculateNetworkRates = (
    networkDayPrice,
    networkNightOrWeekendtPrice,
    UsageDayHours,
    UsageNightHours
  ) => {
    const finalDayRate = (networkDayPrice / 100) * UsageDayHours;
    const finalNightRate =
      (networkNightOrWeekendtPrice / 100) * UsageNightHours;
    return { finalDayRate, finalNightRate };
  };
  const calculateNetworkFinalPrice = (
    dayRate,
    nightRate,
    capacityPrice = 0,
    getPersonalGovSupport
  ) => {
    console.log(dayRate, nightRate, capacityPrice);
    const result = dayRate + nightRate + capacityPrice - getPersonalGovSupport;
    return result;
  };

  const calculatePowerPrice = () => {
    return Number(totalMonthPrice) + Number(fee);
  };

  const totalMonthBill = (hasFixedPrice) => {
    const networkRatesWithGovSupport = calculateNetworkFinalPrice(
      finalDayRate,
      finalNightRate,
      capacityPrice,
      getPersonalGovSupport(isGovSupport)
    );
    if (hasFixedPrice) {
      const totalWithFixedPrice =
        totalUsage * (fixedPrice / 100) + networkRatesWithGovSupport;

      return totalWithFixedPrice.toFixed(2);
    } else {
      return (
        Number(calculatePowerPrice()) + networkRatesWithGovSupport
      ).toFixed(2);
    }
  };
  window.scrollTo(0, 0);
  return (
    <Card className="results-card">
      <div className="d-flex align-content-left flex-column">
        <h2 className="text-decoration-underline ms-2">
          Estimert regning for {month}
        </h2>
        <div className="all-result-tables">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Total Forbruk</th>
                <th scope="col">Snittpris {zone}</th>
                <th scope="col">
                  {" "}
                  Strømstøtte {zone} {lastDay}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalUsage.toFixed(0)} kWh</td>
                <td>{avgPrice.toFixed(2)} øre</td>
                <td>
                  {isGovSupport ? (
                    <p> {govSupport.toFixed(2)} øre pr kwh</p>
                  ) : (
                    <p>Ingen strømstøtte</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="Totals-table mt-1 ms-1">
            <table
              className="table 
             table-striped detailed-table"
            >
              <thead>
                <tr>
                  <th scope="col">Priselement</th>
                  <th scope="col">Forbruk</th>
                  <th scope="col">Pris</th>
                  <th scope="col">Øre/Kr</th>
                  <th scope="col">Sum Kr</th>
                </tr>
              </thead>
              <tbody>
                {surcharge !== 0 && (
                  <tr>
                    <th scope="row">Påslag</th>
                    <td>{totalUsage.toFixed(2)}</td>
                    <td>{surcharge}</td>
                    <td>Øre</td>
                    <td>
                      {surcharge && surcharge !== 0
                        ? ((Number(surcharge) * totalUsage) / 100).toFixed(2)
                        : surcharge == 0
                        ? "0"
                        : ""}
                    </td>
                  </tr>
                )}
                {fee !== 0 && (
                  <tr>
                    <th scope="row">Fast beløp</th>
                    <td>1</td>
                    <td>{fee}</td>
                    <td>Kr</td>
                    <td>{fee}</td>
                  </tr>
                )}
                <tr>
                  <th scope="row">Strøm totalt</th>
                  <td>{totalUsage.toFixed(2)}</td>
                  <td>{!hasFixedPrice ? "time for time" : fixedPrice}</td>
                  <td>Øre</td>
                  <td>
                    {hasFixedPrice
                      ? (totalUsage * (fixedPrice / 100)).toFixed(2)
                      : calculatePowerPrice().toFixed(2)}
                  </td>
                </tr>
                {capacityPrice && (
                  <tr>
                    <th scope="row">Kapasitet Fastledd</th>
                    <td>1</td>
                    <td>{capacityPrice}</td>
                    <td>kr</td>
                    <td>{capacityPrice}</td>
                  </tr>
                )}
                {finalDayRate ? (
                  <tr>
                    <th scope="row">Dag/Høy ledd</th>
                    <td>{UsageDayHours.toFixed(2)}</td>
                    <td>{networkDayPrice}</td>
                    <td>øre</td>
                    <td>{finalDayRate.toFixed(2)}</td>
                  </tr>
                ) : (
                  ""
                )}
                {finalNightRate ? (
                  <tr>
                    <th scope="row">Natt/Helg ledd</th>
                    <td>{UsageNightHours.toFixed(2)}</td>
                    <td>{networkNightOrWeekendtPrice}</td>
                    <td>øre</td>
                    <td>{finalNightRate.toFixed(2)}</td>
                  </tr>
                ) : (
                  ""
                )}
                {isGovSupport ? (
                  <tr>
                    <th scope="row">Strømstøtte:</th>
                    <td>{totalUsagedisplay}</td>
                    <td>{isGovSupport ? govSupport.toFixed(2) : 0}</td>
                    <td>øre</td>
                    <td>-{getPersonalGovSupport(isGovSupport).toFixed(2)}</td>
                  </tr>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="ms-2">
              Total Sum for {month}:{totalMonthBill(hasFixedPrice)} kr{" "}
            </h2>
          </div>
        </div>

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
