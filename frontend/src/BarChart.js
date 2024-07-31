import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import "./styles/barchart.css";

const BarChart = (props) => {
  const lastSeasonStats = props.lastSeasonStats;
  const nextSeasonStats = props.nextSeasonStats;
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const data = {
      labels: ["Points", "Rebounds", "Assists", "Games Played"],
      datasets: [
        {
          label: "2022-23 Season",
          data: lastSeasonStats,
          backgroundColor: "rgb(154, 103, 196)",
        },
        {
          label: "2023-24 Season Predictions",
          data: nextSeasonStats,
          backgroundColor: "#ef955d",
        },
      ],
    };

    const config = {
      type: "bar",
      data: data,
      options: {
        scales: {
          x: {
            grid: {
              color: "#767676", // Grid line color for x-axis
            },
            ticks: {
              color: "#f8f8f7",
            },
            title: {
              color: "#f8f8f7",
            },
          },
          y: {
            grid: {
              color: "#767676", // Grid line color for x-axis
            },
            ticks: {
              color: "#f8f8f7",
            },
            title: {
              color: "#f8f8f7",
            },
          },
        },
        color: "#f8f8f7",
      },
    };

    const chartInstance = new Chart(ctx, config);

    return () => {
      chartInstance.destroy();
    };
  }, [lastSeasonStats, nextSeasonStats]);

  return <canvas id="bar" ref={chartRef}></canvas>;
};

export default BarChart;
