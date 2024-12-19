import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function TopSellingProduct() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productResponse = await axios.get("http://localhost:5000/api/products");
        const products = productResponse.data.reduce((map, product) => {
          map[product._id] = { ...product, quantitySold: 0 }; // Initialize quantitySold
          return map;
        }, {});

        // Fetch orders
        const orderResponse = await axios.get("http://localhost:5000/api/orders");
        const orders = orderResponse.data.orders || [];

        // Calculate total quantity sold for each product
        orders.forEach((order) => {
          order.items.forEach((item) => {
            if (products[item.productId]) {
              products[item.productId].quantitySold += item.quantity;
            }
          });
        });

        // Get top 5 products based on quantity sold
        const topProductsArray = Object.values(products)
          .filter((product) => product.quantitySold > 0) // Exclude unsold products
          .sort((a, b) => b.quantitySold - a.quantitySold) // Sort by quantity sold
          .slice(0, 5); // Take top 5

        setTopProducts(topProductsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        margin: 3,
        bgcolor: "white",
        borderRadius: 2,
        padding: 3,
        height: "95%",
      }}
    >
      <Typography variant="h6" fontWeight={"bold"} sx={{ mx: 3 }}>
        Top Selling Products
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bolder" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Quantity Sold</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantitySold}</TableCell>
                <TableCell>${(product.price * product.quantitySold).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
