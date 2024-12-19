import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";

export default function TotalSales() {
  const [options, setOptions] = useState({
    title: {
      text: "Total Sales",
      align: "left",
      style: {
        fontSize: "16px",
        color: "#666",
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    chart: {
      height: 328,
      type: "line",
      zoom: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 0.2,
      },
    },
    xaxis: {
      categories: [], // Days of the week
    },
  });

  const [series, setSeries] = useState([
    {
      name: "Total Sales",
      data: [], // Total sales per day
    },
  ]);

  useEffect(() => {
    const fetchProductsAndOrders = async () => {
      try {
        // Fetch product data
        const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const products = productResponse.data;
        const productsMap = products.reduce((map, product) => {
          map[product._id] = product;
          return map;
        }, {});

        // Fetch order data
        const orderResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
        const orders = orderResponse.data.orders || [];

        // Get all days of the current week
        const getCurrentWeekDays = () => {
          const currentDate = new Date();
          const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)); // Monday
          const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
            const day = new Date(firstDayOfWeek);
            day.setDate(firstDayOfWeek.getDate() + i);
            return day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          });
          return daysOfWeek;
        };

        const weekDays = getCurrentWeekDays();

        // Initialize sales for each day
        const salesByDay = weekDays.reduce((acc, day) => {
          acc[day] = 0;
          return acc;
        }, {});

        // Process orders
        orders.forEach((order) => {
          const orderDay = new Date(order.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          const totalOrderAmount = order.items.reduce((sum, item) => {
            const product = productsMap[item.productId]; // Lookup product
            return product ? sum + product.price * item.quantity : sum; // Sum up item totals
          }, 0);

          if (salesByDay[orderDay] !== undefined) {
            salesByDay[orderDay] += totalOrderAmount;
          }
        });

        // Prepare data for the chart
        const categories = Object.keys(salesByDay); // Days of the week
        const data = Object.values(salesByDay); // Total sales for each day

        // Update chart options and series
        setOptions((prev) => ({
          ...prev,
          xaxis: { categories },
        }));

        setSeries([
          {
            name: "Total Sales",
            data,
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductsAndOrders();
  }, []);

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
        options={options}
        series={series}
        height={300}
        type="line"
        width="100%"
      />
    </Box>
  );
}
