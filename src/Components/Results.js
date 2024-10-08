import { React, useState, useEffect, useRef } from "react";
import { ButtonGroup, Card } from "react-bootstrap";
import { Button } from "react-bootstrap";

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
  supportRateForMonth,
  selectedYear,
  otherFees,
  isDemo,
  hasNoWeekendRate,
  threeBiggestCapacityNumbers,
}) {
  const [finalDayRate, setFinalDayRate] = useState(0);
  const [finalNightRate, setFinalNightRate] = useState(0);
  const totalUsagedisplay = totalUsage && totalUsage.toFixed(2);
  const [showWithPowerSupport, setShowWithPowerSupport] = useState(true);
  const [personalAvgPrice, setPersonalAvgPrice] = useState();
  const [personlAvgPriceBiggerThanZone, setPersonlAvgPriceBiggerThanZone] =
    useState(false);

  const showPowerSupport = (boolean) => {
    setShowWithPowerSupport(boolean);
  };

  const norwegianMonths = {
    January: "Januar",
    February: "Februar",
    March: "Mars",
    April: "April",
    May: "Mai",
    June: "Juni",
    July: "Juli",
    August: "August",
    September: "September",
    October: "Oktober",
    November: "November",
    December: "Desember",
  };

  useEffect(() => {
    setNetworkRates(
      networkDayPrice,
      networkNightOrWeekendtPrice,
      UsageDayHours,
      UsageNightHours
    );
  }, [totalMonthPrice]);
  const calculateGovSupport = () => {
    if (totalUsage > 5000) {
      return (5000 * govSupport) / 100;
    } else {
      return (totalUsage * govSupport) / 100;
    }
  };

  useEffect(() => {
    setPersonlAvgPriceBiggerThanZone(personalAvgPrice < avgPrice);
  }, [personalAvgPrice]);

  useEffect(() => {
    setPersonalAvgPrice((totalMonthPrice / totalUsage) * 100);
  }, [totalUsage, totalMonthPrice]);

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
    dayRate = 0,
    nightRate = 0,
    capacityPrice = 0,
    getPersonalGovSupport
  ) => {
    const result = dayRate + nightRate + capacityPrice - getPersonalGovSupport;
    return result;
  };

  const calculateSurcharge = (surcharge = 0) => {
    return (surcharge * totalUsage) / 100;
  };

  const totalMonthBill = (
    hasFixedPrice = false,
    WithPowerSupport,
    surcharge = 0,
    fee = 0,
    otherFees = 0
  ) => {
    const networkRatesWithGovSupport = calculateNetworkFinalPrice(
      finalDayRate,
      finalNightRate,
      capacityPrice,
      getPersonalGovSupport(WithPowerSupport)
    );

    if (hasFixedPrice) {
      const totalWithFixedPrice =
        totalUsage * (fixedPrice / 100) +
        networkRatesWithGovSupport +
        fee +
        otherFees;

      return totalWithFixedPrice;
    } else {
      return (
        totalMonthPrice +
        networkRatesWithGovSupport +
        calculateSurcharge(surcharge) +
        Number(fee) +
        otherFees
      );
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="d-flex flex-column">
      {isDemo && (
        <div className="results-example">
          {" "}
          <p className="results-example-txt"> Eksampel-Regning</p>
        </div>
      )}
      <Card className="results-card">
        <div className="d-flex align-content-left flex-column">
          <h2 className="text-decoration-underline ms-2">
            Estimert regning for {norwegianMonths[month]} {selectedYear}
          </h2>
          <div className="all-result-tables">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Total Forbruk</th>
                  <th scope="col">Snittpris {zone}</th>
                  <th scope="col">Din Snittpris</th>
                  <th scope="col">
                    {" "}
                    Strømstøtte {zone} {lastDay}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>{totalUsage.toFixed(2)} kWh</b>
                  </td>
                  <td>{avgPrice.toFixed(2)} øre</td>
                  {personalAvgPrice && (
                    <td
                      className={
                        personlAvgPriceBiggerThanZone
                          ? "avg-price-lower"
                          : "avg-price-higher"
                      }
                    >
                      {personalAvgPrice.toFixed(2)} øre
                    </td>
                  )}
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
            <div className="d-flex flex-row">
              <h4 className="day-max-title">Døgnmakser (3 høyeste kWh):</h4>
              <div className="d-flex flex-row">
                {threeBiggestCapacityNumbers.map((val, idx) => {
                  return (
                    <h4 className="day-max d-flex flex-row" key={idx}>
                      {val}
                    </h4>
                  );
                })}
              </div>
            </div>
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
                        {surcharge !== 0
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
                  {otherFees !== 0 && (
                    <tr>
                      <th scope="row">Andre gebyrer</th>
                      <td>1</td>
                      <td>{otherFees}</td>
                      <td>Kr</td>
                      <td>{otherFees}</td>
                    </tr>
                  )}
                  <tr>
                    <th scope="row">Strøm</th>
                    <td>{totalUsage.toFixed(2)}</td>
                    <td>{!hasFixedPrice ? "time for time" : fixedPrice}</td>
                    <td>Øre</td>
                    <td>
                      {hasFixedPrice
                        ? (totalUsage * (fixedPrice / 100)).toFixed(2)
                        : totalMonthPrice.toFixed(2)}
                    </td>
                  </tr>
                  {capacityPrice !== 0 && (
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
                      <th scope="row">
                        Strømstøtte {supportRateForMonth * 100}%:
                      </th>
                      <td>
                        {Number(totalUsagedisplay) > 5000
                          ? 5000
                          : totalUsagedisplay}
                      </td>
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
            <div className="d-flex flex-column">
              {hasNoWeekendRate && (
                <div className="no-weekend-exp border border-dark ms-2 mb-2 w-90">
                  Nettleie-forklaring for kunder som ikke har helgepriser:
                  Nettselskaper valgte å vise sine beregninger på ulike måter.
                  Noen selskaper velger å trekke rabatten for nattprisen fra
                  dagprisen i stedet for å vise den faktiske nattprisen. Vi
                  bruker i stedet de faktiske prisene som kan plusses for å nå
                  riktig sum. Forhåpentligvis vil en standard bli vedtatt i
                  fremtiden.
                </div>
              )}
              <div className="d-flex ms-2">
                <h3>Vis Sum</h3>
                <ButtonGroup>
                  <Button
                    variant="outline-success"
                    value={true}
                    className="ms-2 me-2"
                    onClick={() => showPowerSupport(true)}
                  >
                    Med Strømstøtte
                  </Button>
                  <Button
                    variant="outline-danger"
                    value={false}
                    onClick={() => {
                      showPowerSupport(false);
                    }}
                  >
                    Uten Strømstøtte
                  </Button>
                </ButtonGroup>
              </div>
            </div>

            <div>
              <h2 className="ms-2">
                Total Sum for {norwegianMonths[month]}:
                {totalMonthBill(
                  hasFixedPrice,
                  showWithPowerSupport,
                  surcharge,
                  fee,
                  otherFees
                ).toFixed(2)}{" "}
                kr{" "}
              </h2>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Results;
