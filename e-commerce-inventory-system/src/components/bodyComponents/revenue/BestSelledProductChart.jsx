import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import { Box } from "@mui/material";

export default function BestSelledProductChart() {
  const [channelData, setChannelData] = useState([]);

  const isSameWeek = (date) => {
    const now = new Date();
    const inputDate = new Date(date);
    const diffInDays = Math.floor((now - inputDate) / (1000 * 60 * 60 * 24));
    return diffInDays < 7 && now.getDay() >= inputDate.getDay();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const products = productResponse.data.reduce((map, product) => {
          map[product._id] = { ...product, weeklyData: [0, 0, 0, 0, 0, 0, 0] }; // Initialize weekly data
          return map;
        }, {});

        // Fetch orders
        const orderResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
        const orders = orderResponse.data.orders || [];

        // Calculate weekly data for each product
        orders.forEach((order) => {
          const orderDate = new Date(order.createdAt);
          if (isSameWeek(orderDate)) {
            const dayOfWeek = orderDate.getDay(); // Get day index (0: Sunday, 6: Saturday)
            order.items.forEach((item) => {
              if (products[item.productId]) {
                products[item.productId].weeklyData[dayOfWeek] += item.quantity;
              }
            });
          }
        });

        // Transform data into chart series format
        const chartData = Object.values(products)
          .filter((product) => product.weeklyData.some((quantity) => quantity > 0)) // Exclude products with no sales
          .slice(0, 5) // Take top 5 products
          .map((product) => ({
            name: product.productName,
            data: product.weeklyData,
          }));

        setChannelData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options3 = {
    chart: {
      id: "basic-bar",
      type: "bar",
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
      text: "Top 5 Best-Selling Products This Week",
    },
    plotOptions: {
      bar: {
        columnWidth: "15%",
        horizontal: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      hover: {
        size: 7,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
        type="line"
        width="100%"
        height="320"
      />
    </Box>
  );
}
