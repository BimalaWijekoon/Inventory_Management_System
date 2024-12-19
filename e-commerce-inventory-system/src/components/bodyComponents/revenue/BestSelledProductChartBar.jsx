import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import { Box } from "@mui/material";

export default function BestSelledProductChartBar() {
  const [channelData, setChannelData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const products = productResponse.data.reduce((map, product) => {
          map[product._id] = { ...product, totalSold: 0 }; // Initialize totalSold
          return map;
        }, {});

        // Fetch orders
        const orderResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
        const orders = orderResponse.data.orders || [];

        // Calculate total sold for each product over the year
        orders.forEach((order) => {
          const orderDate = new Date(order.createdAt);
          if (orderDate.getFullYear() === new Date().getFullYear()) {
            order.items.forEach((item) => {
              if (products[item.productId]) {
                products[item.productId].totalSold += item.quantity;
              }
            });
          }
        });

        // Get top 5 products based on total sold
        const topProducts = Object.values(products)
          .filter((product) => product.totalSold > 0) // Exclude unsold products
          .sort((a, b) => b.totalSold - a.totalSold) // Sort by totalSold
          .slice(0, 5); // Take top 5

        // Prepare chart data
        setChannelData([
          {
            data: topProducts.map((product) => product.totalSold),
          },
        ]);
        setCategories(topProducts.map((product) => product.productName));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options3 = {
    colors: ["#5A4FCF", "#FFA500", "#C53500", "#FFBF00", "#FF3659"],
    chart: {
      id: "basic-bar",
      type: "bar",
      stacked: true,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      offsetY: 0,
    },
    title: {
      text: "Top 5 Best-Selling Products Over the Year",
    },
    plotOptions: {
      bar: {
        distributed: true,
        barHeight: "40%",
        horizontal: true,
      },
    },
    xaxis: {
      categories: categories,
    },
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 30,
        offsetX: 60,
      },
    },
  };

  return (
    <Box
      sx={{
        marginX: 4,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      <ApexCharts
        options={options3}
        series={channelData}
        type="bar"
        width="100%"
        height="320"
      />
    </Box>
  );
}
