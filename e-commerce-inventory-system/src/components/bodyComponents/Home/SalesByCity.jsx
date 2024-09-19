import React from "react";
import { Box } from "@mui/material";
import ApexCharts from "react-apexcharts";

export default function SalesByCity() {
  const donutOption = {
    labels: ["Oujda", "Nador", "Berkan", "Casablanca"],
    legend: {
      position: "right",
      fontSize: "14",

      customLegendItems: [
        "Oujda <b>10%</b>",
        "Nador <b>50%</b>",
        "Berkan <b>30%</b>",
        "Casablanca <b>10%</b>",
      ],
      //   const total = data.reduce((sum, value) => sum + value, 0);
      // const percentages = data.map(value => ((value / total) * 100).toFixed(2) + '%');
    },
    title: {
      text: "Sales By City",
    },
  };
  const donutSeries = [10, 50, 30, 10];

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "100%",
      }}
    >
      <ApexCharts
        options={donutOption}
        series={donutSeries}
        type="pie"
        width="100%"
      />
    </Box>
  );
}
