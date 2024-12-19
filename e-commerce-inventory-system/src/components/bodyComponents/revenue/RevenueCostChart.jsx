import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Box } from "@mui/material";
import axios from "axios";

export default function RevenueCostChart() {
  const [channelData, setChannelData] = useState([]);

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      const products = productResponse.data;
      return products.reduce((map, product) => {
        map[product._id] = product;
        return map;
      }, {});
    } catch (error) {
      console.error("Error fetching products:", error);
      return {};
    }
  };

  const fetchOrders = async (productsMap) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      const orders = response.data.orders || [];
      return orders.map((order) => {
        const totalPrice = order.items.reduce((sum, item) => {
          const product = productsMap[item.productId];
          return product ? sum + product.price * item.quantity : sum;
        }, 0);
        return { ...order, totalPrice };
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  const calculateMonthlyData = (orders) => {
    const revenueByMonth = Array(12).fill(0); // Initialize revenue for each month
    const currentYear = new Date().getFullYear();

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth();
        revenueByMonth[month] += order.totalPrice;
      }
    });

    const costByMonth = revenueByMonth.map((revenue) =>
      revenue > 0 ? Math.random() * (1.2 * revenue - 0.8 * revenue) + 0.8 * revenue : 0
    );

    return { revenueByMonth, costByMonth };
  };

  useEffect(() => {
    const fetchData = async () => {
      const productsMap = await fetchProducts();
      const orders = await fetchOrders(productsMap);
      const { revenueByMonth, costByMonth } = calculateMonthlyData(orders);

      setChannelData([
        {
          name: "Revenue",
          type: "column",
          data: revenueByMonth,
        },
        {
          name: "Cost",
          type: "column",
          data: costByMonth.map((value) => parseFloat(value.toFixed(2))),
        },
      ]);
    };

    fetchData();
  }, []);

  const options3 = {
    colors: ["#00D100", "#FF2E2E"],
    chart: {
      id: "revenue-cost-chart",
      type: "bar",
      stacked: false,
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
      text: "Cost & Revenue over Year",
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        horizontal: false,
      },
    },
    fill: {
      opacity: 1,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
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
