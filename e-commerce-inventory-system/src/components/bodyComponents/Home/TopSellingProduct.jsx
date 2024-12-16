import React from "react";
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
  const products = [
    { name: "Addidas White Pair", price: 25.0, quantity: 30 },
    { name: "Nike Black Pair", price: 45.0, quantity: 28 },
    { name: "Black Linen Shirt", price: 15.0, quantity: 27 },
    { name: "Beige Pants", price: 20.0, quantity: 25 },
    { name: "Black Shorts", price: 18.0, quantity: 20 },
  ];

  // Recursive function to calculate amounts
  const calculateAmounts = (products, index = 0) => {
    // Base case: If index is out of bounds, return an empty array
    if (index >= products.length) {
      return [];
    }

    // Calculate amount for the current product
    const currentAmount = {
      ...products[index],
      amount: products[index].price * products[index].quantity,
    };

    // Recursive call for the remaining products
    return [currentAmount, ...calculateAmounts(products, index + 1)];
  };

  // Get updated products with amounts
  const updatedProducts = calculateAmounts(products);

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
              <TableCell sx={{ fontWeight: "bolder" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updatedProducts.map((product, id) => (
              <TableRow key={id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>${product.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
