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
    return orders.flatMap((order) =>
      order.items.map((item, index) => ({
        id: `${order._id}-${index}`, // Unique ID for each row
        customerName: order.customerName,
        item: `${item.colorOrBrand} ${item.category}`,
        quantity: item.quantity,
        fullOrder: order, // Include the full order for "View Details"
      }))
    );
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
        field: "customerName",
        headerName: "Customer Name",
        flex: 1,
      },
      {
        field: "item",
        headerName: "Item",
        flex: 2,
      },
      {
        field: "quantity",
        headerName: "Quantity",
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
