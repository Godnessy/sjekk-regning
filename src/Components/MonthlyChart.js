import { React, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

function MonthlyChart({ usageData }) {
  const options = {
    interaction: {
      mode: "index",
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Månedlig Oversikt ",
      },
      tooltips: {
        mode: "index",
        intersect: false,
      },
    },
  };
  const [dailyData, setDailyData] = useState([]);

  function calculateDailyValues(dataForHour) {
    let dailyDataObj = {};
    let prevUsage = 0;
    let prevPrice = 0;
    for (let hour of dataForHour) {
      let { date, usage, totalPricePrHour } = hour;
      usage = Number(usage);
      if (!dailyDataObj[date]) {
        dailyDataObj[date] = {
          totalUsage: usage,
          totalPrice: totalPricePrHour,
        };
      } else {
        dailyDataObj[date] = {
          totalUsage: prevUsage + usage,
          totalPrice: prevPrice + totalPricePrHour,
        };
      }
      prevUsage = dailyDataObj[date].totalUsage;
      prevPrice = dailyDataObj[date].totalPrice;
    }
    setDailyData(dailyDataObj);
  }
  useEffect(() => {
    calculateDailyValues(usageData);
  }, [usageData]);

  const allUsages = Object.entries(dailyData)?.map((day) => {
    return day[1].totalUsage;
  });

  const allPrices = Object.entries(dailyData)?.map((day) => {
    return day[1].totalPrice;
  });

  const data = {
    labels: Object.keys(dailyData),
    datasets: [
      {
        type: "line",
        label: "Pris for dagen",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        fill: false,
        data: allPrices,
      },
      {
        type: "bar",
        label: "Forbruk",
        data: allUsages,
        backgroundColor: "#99cccc",
      },
    ],
  };
  return (
    <div className=" chart-bar card">
      <Chart className="chart-self" type="bar" data={data} options={options} />
    </div>
  );
}

export default MonthlyChart;
