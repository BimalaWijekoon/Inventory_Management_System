import React from "react";
import { Box } from "@mui/material";
import ApexCharts from "react-apexcharts";

export default function SalesByCategory() {
  const donutOption = {
    labels: ["TShirt", "Shirt", "Shoes", "Trousers", "Socks", "Shorts"],
    legend: {
      position: "right",
      fontSize: "14",

      customLegendItems: [
        "TShirt <b>10%</b>",
        "Shirt <b>20%</b>",
        "Shoes <b>30%</b>",
        "Trousers <b>15%</b>",
        "Socks <b>12%</b>",
        "Shorts <b>13%</b>",
      ],
      //   const total = data.reduce((sum, value) => sum + value, 0);
      // const percentages = data.map(value => ((value / total) * 100).toFixed(2) + '%');
    },
    title: {
      text: "Sales By Category",
    },
  };
  const donutSeries = [10, 20, 30, 15, 12, 13];

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
