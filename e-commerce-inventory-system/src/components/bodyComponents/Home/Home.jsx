import React, { Component } from "react";
import { Box, Grid } from "@mui/material";
import UilReceipt from "@iconscout/react-unicons/icons/uil-receipt";
import UilBox from "@iconscout/react-unicons/icons/uil-box";
import UilTruck from "@iconscout/react-unicons/icons/uil-truck";
import UilCheckCircle from "@iconscout/react-unicons/icons/uil-check-circle";
import InfoCard from "../../subComponents/InfoCard";
import TotalSales from "./TotalSales";
import SalesByCategoty from "./SalesByCategory";
import TopSellingProduct from "./TopSellingProduct";
import axios from "axios";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todaySalesCount: 0, // Store today's sales count
      inventoryCount: 0, // Store inventory count (product count)
      shippedCount: 0, // Store shipped count
      deliveredCount: 0, // Store delivered count
    };
  }

  componentDidMount() {
    this.fetchOrders();
    this.fetchProducts();
  }

  // Fetch orders and calculate today's sales
  fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      const orders = response.data.orders || [];

      // Calculate today's sales count
      const today = new Date().toDateString(); // Current day in string format
      const todaySalesCount = orders.filter((order) => {
        const orderDate = new Date(order.createdAt).toDateString();
        return orderDate === today;
      }).length;

      // Distribute today's sales count equally between "Shipped" and "Delivered"
      const shippedCount = Math.floor(todaySalesCount / 2);
      const deliveredCount = todaySalesCount - shippedCount;

      this.setState({
        todaySalesCount,
        shippedCount,
        deliveredCount,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch products to get inventory count
  fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      const products = response.data || [];
      const inventoryCount = products.length;

      this.setState({ inventoryCount });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  render() {
    const { todaySalesCount, inventoryCount, shippedCount, deliveredCount } = this.state;

    const cardComponent = [
      {
        icon: <UilBox size={60} color={"#F6F4EB"} />,
        title: "Inventory",
        subTitle: inventoryCount.toString(), // Show total inventory count
        mx: 3,
        my: 0,
      },
      {
        icon: <UilTruck size={60} color={"#F6F4EB"} />,
        title: "Shipped",
        subTitle: shippedCount.toString(), // Show shipped count based on distribution
        mx: 5,
        my: 0,
      },
      {
        icon: <UilCheckCircle size={60} color={"#F6F4EB"} />,
        title: "Delivered",
        subTitle: deliveredCount.toString(), // Show delivered count based on distribution
        mx: 5,
        my: 0,
      },
      {
        icon: <UilReceipt size={60} color={"#F6F4EB"} />,
        title: "Today Sales",
        subTitle: todaySalesCount.toString(), // Show today's sales count
        mx: 3,
        my: 0,
      },
    ];

    const data = {};

    return (
      <Box
        sx={{
          margin: 0,
          padding: 3,
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginX: 3,
            borderRadius: 2,
            padding: 0,
          }}
        >
          {cardComponent.map((card, index) => (
            <Grid item md={3} key={index}>
              <InfoCard card={card} />
            </Grid>
          ))}
        </Grid>

        <Grid container sx={{ marginX: 3 }}>
          <Grid item md={12}>
            <TotalSales data={data} />
          </Grid>
        </Grid>

        <Grid container sx={{ margin: 3 }}>
          <Grid item md={6}>
            <SalesByCategoty data={data} />
          </Grid>
          <Grid item md={6}>
            <TopSellingProduct />
          </Grid>
        </Grid>
      </Box>
    );
  }
}
