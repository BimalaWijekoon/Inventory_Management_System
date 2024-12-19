import React, { Component } from "react";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Link } from "react-router-dom";
import OrderModal from "./OrderModal";

export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [], // State to hold fetched orders
      products: [], // State to hold fetched product prices
      open: false,
      selectedOrder: null, // Selected order for the modal
    };
  }

  componentDidMount() {
    this.loadData(); // Combined method to fetch products and orders
  }

  // Combined fetch method to ensure products are loaded before orders
  loadData = async () => {
    try {
      await this.fetchProducts(); // Fetch products first
      await this.fetchOrders(); // Fetch orders after products
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  fetchProducts = async () => {
    try {
      const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      const products = productResponse.data.map((product) => ({
        ...product,
        id: product._id, // Ensure compatibility with DataGrid row structure
      }));
  
      // Create a map for quick lookups
      const productsMap = products.reduce((map, product) => {
        map[product._id] = product; // Use product._id as the key
        return map;
      }, {});
  
      this.setState({ productsMap }); // Store the map in state for lookup
      console.log("Fetched Products:", products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);
      const orders = response.data.orders || [];
      console.log("Fetched Orders:", orders);
  
      const rows = this.processOrders(orders);
      this.setState({ orders: rows });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  processOrders = (orders) => {
    const { productsMap } = this.state; // Access the product lookup map
  
    return orders.map((order) => {
      // Combine items into a readable string
      const items = order.items
        .map((item) => `${item.quantity} x ${item.productName}`)
        .join(", ");
  
      // Calculate the total price using the product map
      const totalPrice = order.items.reduce((sum, item) => {
        const product = productsMap[item.productId]; // Lookup product by productId
  
        if (!product) {
          console.warn(`Product not found: ${item.productId}`);
          return sum; // Skip if product not found
        }
  
        return sum + product.price * item.quantity;
      }, 0);
  
      return {
        id: order._id,
        orderId: order._id,
        customerName: order.customerName,
        items,
        totalPrice: totalPrice.toFixed(2), // Format to 2 decimal places
        fullOrder: order,
      };
    });
  };
  

  handleOrderDetail = (order) => {
    this.setState({ selectedOrder: order, open: true });
  };

  handleClose = () => {
    this.setState({ open: false, selectedOrder: null });
  };

  render() {
    const columns = [
      {
        field: "orderId",
        headerName: "Order ID",
        flex: 2,
      },
      {
        field: "customerName",
        headerName: "Customer Name",
        flex: 2,
      },
      {
        field: "items", // New column for Items
        headerName: "Items",
        flex: 4,
      },
      {
        field: "totalPrice",
        headerName: "Total Price ($)",
        flex: 1,
        type: "number",
      },
    ];

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
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Link to="/addorder">
            <Button variant="contained" color="primary">
              + Add New Order
            </Button>
          </Link>
        </Box>

        <DataGrid
          sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
          rows={this.state.orders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 15, 20]}
          rowSelection={false}
        />

        <Modal open={this.state.open} onClose={this.handleClose}>
          <Box sx={{ p: 3, bgcolor: "white", borderRadius: 2 }}>
            <OrderModal order={this.state.selectedOrder} />
          </Box>
        </Modal>
      </Box>
    );
  }
}
