import React, { Component } from "react";
import { Box } from "@mui/material";
import ApexCharts from "react-apexcharts";
import axios from "axios";

export default class SalesByCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [], // Labels for the chart
      percentages: [], // Series for the chart
    };
  }

  componentDidMount() {
    this.fetchProductsAndOrders();
  }

  fetchProductsAndOrders = async () => {
    try {
      // Fetch products
      const productResponse = await axios.get("http://localhost:5000/api/products");
      const products = productResponse.data.map((product) => ({
        ...product,
        id: product._id,
      }));

      // Create a product map for lookup
      const productMap = products.reduce((map, product) => {
        map[product._id] = product;
        return map;
      }, {});

      // Fetch orders
      const orderResponse = await axios.get("http://localhost:5000/api/orders");
      const orders = orderResponse.data.orders || [];

      // Calculate sales by category
      const categorySales = orders.reduce((acc, order) => {
        order.items.forEach((item) => {
          const product = productMap[item.productId];
          if (product) {
            const category = product.category || "Uncategorized"; // Use "Uncategorized" if no category
            acc[category] = (acc[category] || 0) + item.quantity;
          }
        });
        return acc;
      }, {});

      // Calculate percentages
      const totalSales = Object.values(categorySales).reduce((sum, qty) => sum + qty, 0);
      const categories = Object.keys(categorySales);
      const percentages = Object.values(categorySales).map(
        (qty) => ((qty / totalSales) * 100).toFixed(2)
      );

      this.setState({ categories, percentages });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  render() {
    const { categories, percentages } = this.state;

    const donutOption = {
      labels: categories,
      legend: {
        position: "right",
        fontSize: "14",
        customLegendItems: categories.map(
          (category, index) => `${category} <b>${percentages[index]}%</b>`
        ),
      },
      title: {
        text: "Sales By Category",
      },
    };

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
          series={percentages.map(Number)} // Convert percentages to numbers
          type="pie"
          width="100%"
        />
      </Box>
    );
  }
}
