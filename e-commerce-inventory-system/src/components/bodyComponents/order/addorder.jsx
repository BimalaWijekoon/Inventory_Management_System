import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { mergeSort } from "./sorting"; // Import the mergeSort function

const AddOrder = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState("");
  const [sortModel, setSortModel] = useState([]); // Track the sort model

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      const products = response.data.map((product) => ({
        ...product,
        id: product._id, // Ensure unique IDs for DataGrid
      }));
      setAllProducts(products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleRowSelection = (ids) => {
    setSelectedRows(ids);
  };

  const handleQuantityChange = (id, value) => {
    setQuantities({
      ...quantities,
      [id]: value || 1, // Default quantity to 1
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const selectedItems = selectedRows.map((id) => {
      const product = allProducts.find((p) => p.id === id);
      return {
        productId: product.id,
        productName: product.productName,
        quantity: quantities[id] || 1,
      };
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
        customerName,
        mobileNumber,
        items: selectedItems,
      });

      alert("Order submitted successfully!");
      console.log("Order Submitted: ", response.data);

      setCustomerName("");
      setMobileNumber("");
      setSelectedRows([]);
      setQuantities({});
      navigate("/orders");
    } catch (error) {
      console.error("Error submitting order: ", error);
      setError("There was an error submitting the order. Please try again.");
    }
  };

  // Apply custom sorting using mergeSort
  const applySorting = (products, sortModel) => {
    if (!sortModel.length) return products;

    const { field, sort } = sortModel[0]; // Get the first sort model

    return mergeSort(products, (a, b) => {
      if (a[field] < b[field]) return sort === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sort === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedProducts = applySorting(allProducts, sortModel);

  const columns = [
    { field: "productId", headerName: "Product ID", width: 100 },
    { field: "productName", headerName: "Product Name", width: 200 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "quantityInput",
      headerName: "Quantity",
      width: 150,
      renderCell: (params) => (
        <TextField
          type="number"
          variant="outlined"
          size="small"
          value={quantities[params.row.id] || ""}
          onChange={(e) => handleQuantityChange(params.row.id, parseInt(e.target.value))}
          inputProps={{ min: 1 }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ margin: 3, padding: 3, bgcolor: "white", borderRadius: 2, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Add New Order
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <Box sx={{ my: 2 }}>
          <TextField
            label="Customer Name"
            variant="outlined"
            fullWidth
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            type="tel"
            pattern="[0-9]{10}"
          />
        </Box>

        {/* Product Selection Table */}
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Select Products and Quantities
        </Typography>
        <DataGrid
          rows={sortedProducts}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(ids) => handleRowSelection(ids)}
          pageSizeOptions={[5, 10, 20]}
          autoHeight
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
        />

        {/* Submit Button */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" type="submit" disabled={!selectedRows.length}>
            Confirm Order
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddOrder;
