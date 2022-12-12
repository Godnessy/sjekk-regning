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
  lastDay,
  zone,
  networkDayPrice,
  networkNightOrWeekendtPrice,
  UsageDayHours,
  UsageNightHours,
  capacityPrice,
}) {
  const [isSupport, setIsSupport] = useState(false);
  const [totalWithSupport, setTotalWithSupport] = useState(false);
  const [finalDayRate, setFinalDayRate] = useState();
  const [finalNightRate, setFinalNightRate] = useState();
  const govSupportCheckboxRef = useRef();

  const totalUsagedisplay = totalUsage && totalUsage.toFixed(2);
  useEffect(() => {
    avgPrice > 70 ? setIsSupport(true) : setIsSupport(false);
  }, [avgPrice]);

  const calculateGovSupport = () => {
    return (totalUsage * govSupport) / 100;
  };

  const getPersonalGovSupport = (totalWithSupport) => {
    return totalWithSupport ? calculateGovSupport() : 0;
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

  const calculateNetworkFinalPrice = () => {
    console.log(
      finalDayRate,
      finalNightRate,
      capacityPrice,
      getPersonalGovSupport(true)
    );
    const result =
      finalDayRate +
      finalNightRate +
      capacityPrice -
      getPersonalGovSupport(true);
    return result;
  };

  const calculatePowerPrice = () => {
    return Number(totalMonthPrice) + Number(fee);
  };

  const calculateAvgPriceZone = () =>
    ((totalMonthPrice / totalUsage) * 100).toFixed(2);
  useEffect(() => {
    setNetworkRates(
      networkDayPrice,
      networkNightOrWeekendtPrice,
      UsageDayHours,
      UsageNightHours
    );
  }, [totalMonthPrice]);

  const totalMonthBill =
    Number(calculatePowerPrice()) + calculateNetworkFinalPrice();

  window.scrollTo(0, 0);
  return (
    <Card className="results-card">
      <div className="d-flex align-content-left flex-column">
        <h2 className="text-decoration-underline ms-2">
          Estimert regning for {month}
        </h2>
        <div class="all-result-tables">
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
                  {avgPrice > 70 ? (
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
                  <td>time for time</td>
                  <td>Øre</td>
                  <td>
                    {hasFixedPrice
                      ? totalUsage * Number(fixedPrice)
                      : calculatePowerPrice().toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Kapasitet Fastledd</th>
                  <td>1</td>
                  <td>{capacityPrice}</td>
                  <td>kr</td>
                  <td>{capacityPrice}</td>
                </tr>
                {finalDayRate && (
                  <tr>
                    <th scope="row">Dag/Høy ledd</th>
                    <td>{totalUsagedisplay}</td>
                    <td>{networkDayPrice}</td>
                    <td>øre</td>
                    <td>{finalDayRate.toFixed(2)}</td>
                  </tr>
                )}
                {finalNightRate && (
                  <tr>
                    <th scope="row">Natt/Helg ledd</th>
                    <td>{totalUsagedisplay}</td>
                    <td>{networkNightOrWeekendtPrice}</td>
                    <td>øre</td>
                    <td>{finalNightRate.toFixed(2)}</td>
                  </tr>
                )}
                <tr>
                  <th scope="row">Strømstøtte:</th>
                  <td>{totalUsagedisplay}</td>
                  <td>{govSupport.toFixed(2)}</td>
                  <td>øre</td>
                  <td>{getPersonalGovSupport(true).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="ms-2">
              Total Sum for {month}:{totalMonthBill.toFixed(2)} kr{" "}
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
