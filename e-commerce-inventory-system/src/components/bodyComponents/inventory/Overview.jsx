import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Overview() {
  const [totalProductValue, setTotalProductValue] = useState(0); // Total value of all products
  const [totalProducts, setTotalProducts] = useState(0); // Total quantity of all products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetch all products
        const response = await axios.get("http://localhost:5000/api/products");
        const products = response.data;

        // Extract price and quantity into separate arrays
        const prices = products.map((product) => product.price);
        const quantities = products.map((product) => product.quantity);

        // Recursive function to calculate total product value
        const calculateTotalValue = (priceArray, quantityArray, index = 0) => {
          if (index === priceArray.length) return 0; // Base case: no more products
          return priceArray[index] * quantityArray[index] + calculateTotalValue(priceArray, quantityArray, index + 1);
        };

        // Recursive function to calculate total quantity
        const calculateTotalQuantity = (quantityArray, index = 0) => {
          if (index === quantityArray.length) return 0; // Base case: no more products
          return quantityArray[index] + calculateTotalQuantity(quantityArray, index + 1);
        };

        // Calculate total value and quantity
        const totalValue = calculateTotalValue(prices, quantities);
        const totalQuantity = calculateTotalQuantity(quantities);

        setTotalProductValue(totalValue);
        setTotalProducts(totalQuantity);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
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
                  {totalProducts.toLocaleString()} {/* Format as number */}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Today Sell</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  5241
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total Product Value</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {"$" + totalProductValue.toLocaleString()} {/* Format as number */}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total Sell</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  11425
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Product Reserved</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  6547
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Stock Issues</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  9562
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
