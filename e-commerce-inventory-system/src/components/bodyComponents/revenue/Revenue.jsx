import React, { Component } from "react";
import axios from "axios";
import RevenueCard from "./RevenueCard";
import { Box, Grid } from "@mui/material";
import RevenueCostChart from "./RevenueCostChart";
import BestSelledProductChart from "./BestSelledProductChart";
import BestSelledProductChartBar from "./BestSelledProductChartBar";

export default class Revenue extends Component {
  state = {
    totalOrders: 0,
    totalProducts: 0,
    totalProductsSold: 0,
    totalRevenue: 0,
  };

  fetchProducts = async () => {
    try {
      const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      const products = productResponse.data;
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      const orders = response.data.orders || [];
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  calculateStats = async () => {
    const products = await this.fetchProducts();
    const orders = await this.fetchOrders();

    const currentYear = new Date().getFullYear();
    let totalProductsSold = 0;
    let totalRevenue = 0;

    orders.forEach((order) => {
      const orderYear = new Date(order.createdAt).getFullYear();
      if (orderYear === currentYear) {
        totalProductsSold += order.items.reduce((sum, item) => sum + item.quantity, 0);
        totalRevenue += order.items.reduce((sum, item) => {
          const product = products.find((p) => p._id === item.productId);
          return product ? sum + product.price * item.quantity : sum;
        }, 0);
      }
    });

    this.setState({
      totalOrders: orders.length,
      totalProducts: products.length,
      totalProductsSold,
      totalRevenue: totalRevenue.toFixed(2),
    });
  };

  componentDidMount() {
    this.calculateStats();
  }

  render() {
    const { totalOrders, totalProducts, totalProductsSold, totalRevenue } = this.state;

    const revenueCards = [
      {
        isMoney: false,
        number: totalOrders,
        title: "Total Orders This Year",
      },
      {
        isMoney: false,
        number: totalProducts,
        title: "Total Products",
      },
      {
        isMoney: false,
        number: totalProductsSold,
        title: "Products Sold This Year",
      },
      {
        isMoney: true,
        number: totalRevenue,
        title: "Revenue This Year",
      },
    ];

    return (
      <Box sx={{ p: 3, mx: 3 }}>
        <Grid container sx={{ mx: 4 }}>
          {revenueCards.map((card, index) => (
            <Grid item md={3} key={index}>
              <Box m={4}>
                <RevenueCard card={card} />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Grid container sx={{ mx: 4 }}>
          <Grid item md={12}>
            <RevenueCostChart />
          </Grid>
        </Grid>
        <Grid container sx={{ mx: 4 }}>
          <Grid item md={6}>
            <BestSelledProductChart />
          </Grid>
          <Grid item md={6}>
            <BestSelledProductChartBar />
          </Grid>
        </Grid>
      </Box>
    );
  }
}
