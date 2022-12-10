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

  useEffect(() => {
    avgPrice > 70 ? setIsSupport(true) : setIsSupport(false);
  }, [avgPrice]);

  const calculateGovSupport = () => {
    return (totalUsage * govSupport) / 100;
  };
  const createGovSupportDiv = () => {
    if (avgPrice > 70) {
      return (
        <h3 className="ps-2">Din strømstøtte: {calculateGovSupport()} kr</h3>
      );
    } else {
      return "";
    }
  };

  const getGovSupport = (totalWithSupport) => {
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
    const toPayDayRates = (networkDayPrice / 100) * UsageDayHours;
    const toPayNightAndWeekends =
      (networkNightOrWeekendtPrice / 100) * UsageNightHours;
    const finalDayRate = toPayDayRates;
    const finalNightRate = toPayNightAndWeekends;
    return { finalDayRate, finalNightRate };
  };

  const calculateNetworkFinalPrice = () => {
    console.log(
      finalDayRate,
      finalNightRate,
      capacityPrice,
      getGovSupport(true)
    );
    const result =
      finalDayRate + finalNightRate + capacityPrice - getGovSupport(true);
    return result;
  };

  const calculatePowerPrice = () => {
    return (Number(totalMonthPrice) + Number(fee)).toFixed(2);
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

  return (
    <Card className="mx-4">
      <div className="d-flex align-content-left flex-column">
        <h2 className="text-decoration-underline p-2">
          Estimert regning for {month}
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

        {fee !== 0 && <h2 className="ps-2">Månedspris : {fee} kr</h2>}
        {!hasFixedPrice && (
          <h2 className="ps-2">
            Din snittpris : {calculateAvgPriceZone()} øre pr kwh
          </h2>
        )}
        <div className="mt-3 mx-1 total-price d-flex  flex-column">
          <h3> Å betale for {month}: </h3>
          <div className="d-flex">
            <h4 className="text-decoration-underline">
              Strøm: {calculatePowerPrice()} kr
            </h4>
          </div>
          {finalDayRate && (
            <div>
              <h4>
                <p className="">Nettleie:</p>
                <p>Fastledd : {capacityPrice} kr</p>
                <p>Dag/høy ledd: {finalDayRate.toFixed(2)} kr</p>
                <p>natt/helg/lav ledd: {finalNightRate.toFixed(2)} kr</p>
                <p>Strømstøtte: {getGovSupport(true).toFixed(2)} kr</p>
                <p className="text-decoration-underline">
                  Nettleie Totalt:
                  {calculateNetworkFinalPrice().toFixed(2)} kr
                </p>
              </h4>
              <h2>Total regning: {totalMonthBill.toFixed(2)}</h2>
            </div>
          )}
          <div></div>
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
