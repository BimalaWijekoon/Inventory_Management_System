import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"; 
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Overview() {
  const [totalProductValue, setTotalProductValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalProductValue = async () => {
      try {
        const response = await axios.get("/api/products/total-value");
        // Ensure the value is a valid number
        setTotalProductValue(response.data.totalProductValue || 0);
      } catch (error) {
        console.error("Error fetching total product value:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalProductValue();
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
              <TableCell>Total Product</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  15226
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Today sell</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  5241
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total product value</TableCell>
              <TableCell align="right">
                <Typography variant="subtitle1" fontWeight="bold">
                  {totalProductValue.toLocaleString()} {/* Format as number */}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total sell</TableCell>
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
