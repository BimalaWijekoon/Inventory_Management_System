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

  // Fetch orders from the backend
  fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders"); // Call the backend API
      const orders = response.data.orders || []; // Extract orders from the response
      console.log("Fetched Orders: ", orders); // Debug fetched orders
      const rows = this.processOrders(orders); // Transform orders for DataGrid
      this.setState({ orders: rows }); // Update state with processed orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch product prices from the backend
  fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products"); // Call the backend API for products
      const products = response.data.products || []; // Extract the product prices from the response
      console.log("Fetched Products: ", products); // Debug fetched products
      this.setState({ products }); // Update state with product prices
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Process orders into DataGrid row format
  processOrders = (orders) => {
    return orders.map((order) => {
      // Prepare items as a string (e.g., "2 x Blue Shirt, 1 x Nike Shoes")
      const items = order.items
        .map(
          (item) =>
            `${item.quantity} x ${item.productName}` // Format each item
        )
        .join(", ");

      // Calculate the total price for this order using the fetched product prices
      const totalPrice = order.items.reduce((sum, item) => {
        const product = this.state.products.find(
          (product) =>
            product.name.trim().toLowerCase() ===
            item.productName.trim().toLowerCase() // Match case-insensitively
        );
        if (!product) {
          console.warn(`Product not found: ${item.productName}`); // Log missing products
        }
        const price = product ? product.price : 0; // Use the price from the product table, default to 0 if not found
        return sum + price * item.quantity; // Add (price * quantity) to the total
      }, 0);

      // Additional quantity-based calculation for each item
      const quantityCalculations = order.items.map((item) => {
        const product = this.state.products.find(
          (product) =>
            product.name.trim().toLowerCase() ===
            item.productName.trim().toLowerCase()
        );
        if (!product) {
          console.warn(`Product not found: ${item.productName}`); // Log missing products
        }
        const price = product ? product.price : 0;
        return {
          productName: item.productName,
          calculatedValue: price * item.quantity, // Perform the calculation
        };
      });

      console.log("Quantity-based Calculations:", quantityCalculations);

      return {
        id: order._id, // Unique ID for each order
        orderId: order._id,
        customerName: order.customerName,
        items, // All items as a single string
        totalPrice: totalPrice.toFixed(2), // Total price for the order
        fullOrder: order, // Include the full order for "View Details"
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
