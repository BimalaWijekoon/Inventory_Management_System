import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Overview() {
  const [totalProductValue, setTotalProductValue] = useState(0); // Total value of all products
  const [totalProducts, setTotalProducts] = useState(0); // Total quantity of all products
  const [totalOrders, setTotalOrders] = useState(0); // Total number of orders
  const [totalOrderItems, setTotalOrderItems] = useState(0); // Total number of items in orders
  const [productRemaining, setProductRemaining] = useState(0); // Remaining products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products
        const productResponse = await axios.get("http://localhost:5000/api/products");
        const products = productResponse.data;

        // Extract price and quantity into separate arrays
        const prices = products.map((product) => product.price);
        const quantities = products.map((product) => product.quantity);

        // Recursive function to calculate total product value
        const calculateTotalValue = (priceArray, quantityArray, index = 0) => {
          if (index === priceArray.length) return 0;
          return priceArray[index] * quantityArray[index] + calculateTotalValue(priceArray, quantityArray, index + 1);
        };

        // Recursive function to calculate total quantity
        const calculateTotalQuantity = (quantityArray, index = 0) => {
          if (index === quantityArray.length) return 0;
          return quantityArray[index] + calculateTotalQuantity(quantityArray, index + 1);
        };

        // Calculate total value and quantity
        const totalValue = calculateTotalValue(prices, quantities);
        const totalQuantity = calculateTotalQuantity(quantities);

        setTotalProductValue(totalValue);
        setTotalProducts(totalQuantity);

        // Fetch total orders and calculate total order items
        const orderResponse = await axios.get("http://localhost:5000/api/orders");
        const orders = orderResponse.data.orders;

        // Sum up the quantities of items in each order
        const calculateTotalOrderItems = (orders, index = 0) => {
          if (index === orders.length) return 0; // Base case: no more orders
          const currentOrderQuantity = orders[index].items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ); // Sum the quantities in the current order
          return currentOrderQuantity + calculateTotalOrderItems(orders, index + 1);
        };

        const totalItems = calculateTotalOrderItems(orders);
        setTotalOrders(orders.length); // Count the number of orders
        setTotalOrderItems(totalItems); // Set total order items

        // Calculate remaining products
        setProductRemaining(totalQuantity - totalItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Total Products</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {totalProducts.toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total Product Value</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {"$" + totalProductValue.toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total Orders</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {totalOrders.toLocaleString()} {/* Display fetched total orders */}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total Order Items</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {totalOrderItems.toLocaleString()} {/* Display total items */}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Product Remaining</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {productRemaining.toLocaleString()} {/* Product Remaining */}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
