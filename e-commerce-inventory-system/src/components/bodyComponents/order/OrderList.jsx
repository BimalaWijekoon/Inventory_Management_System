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
      open: false,
      selectedOrder: null, // Selected order for the modal
      prices: {
        "Blue Shirt": 10,
        "Green Shirt": 10,
        "Black Shirt": 90,
        "Grey T-shirt": 8,
        "Yellow T-shirt": 8,
        "White T-shirt": 8,
        "Blue Shorts": 5,
        "Black Shorts": 5,
        "Red Shorts": 5,
        "Low Cut Socks": 4,
        "Grey Trousers": 5,
        "Leather Shoes": 20,
        "Anklets Socks": 5,
        "Mid-Calf Socks": 8,
        "Canvas Shoes": 30,
        "Cleats": 50,
        "Boots": 40,
        "Nike Shoes": 180,
        "Linen Shirt": 20, // Newly added
        "Black Shoes": 50, // Newly added
        "Beige Trousers": 18, // Newly added
        "Black Tshirt": 8, // Newly added
        "Adidas Shoes": 120, // Newly added
      },
    };
  }

  componentDidMount() {
    this.fetchOrders(); // Fetch orders when the component mounts
  }

  // Fetch orders from the backend
  fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders"); // Call the backend API
      const orders = response.data.orders; // Extract the orders from the response
      const rows = this.processOrders(orders); // Transform orders for DataGrid
      this.setState({ orders: rows }); // Update state with processed orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Process orders into DataGrid row format
  processOrders = (orders) => {
    return orders.map((order) => {
      // Prepare items as a string (e.g., "2 x Blue Shirt, 1 x Nike Shoes")
      const items = order.items
        .map(
          (item) =>
            `${item.quantity} x ${item.colorOrBrand} ${item.category}` // Format each item
        )
        .join(", ");

      // Calculate the total price for this order
      const totalPrice = order.items.reduce((sum, item) => {
        const key = `${item.colorOrBrand} ${item.category}`; // Construct key like "Blue Shirt"
        const price = this.state.prices[key] || 0; // Match product name with price
        return sum + price * item.quantity; // Add (price * quantity) to the total
      }, 0);

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
