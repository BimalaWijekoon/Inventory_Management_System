import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { Component } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import OrderModal from "./OrderModal";
import orders from "./listOrders";

export default class OrderList extends Component {
  handlOrderDetail = (order) => {
    console.log("the order is : ", order);
    this.setState({ order: order, open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  constructor(props) {
    super(props);
    this.state = {
      order: {},
      open: false,
    };
  }

  render() {
    const columns = [
      // column definitions remain the same
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
        {/* Box wrapper to move the button to the right */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Link to="/addorder"> {/* Navigate to AddOrder page */}
            <Button
              variant="contained"
              color="primary"
            >
              + Add New Order
            </Button>
          </Link>
        </Box>

        <DataGrid
          sx={{
            borderLeft: 0,
            borderRight: 0,
            borderRadius: 0,
          }}
          rows={orders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[15, 20, 30]}
          rowSelection={false}
        />
        
        <Modal open={this.state.open} onClose={this.handleClose}>
          <Box>
            <OrderModal order={this.state.order} />
          </Box>
        </Modal>
      </Box>
    );
  }
}
