import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid, Container, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import axios from "axios";

export default function AddProduct() {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const [errors, setErrors] = useState({
    productId: "",
    productName: "",
    price: "",
    quantity: "",
    category: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Validation functions
  const validateProductId = () => {
    if (!productId.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, productId: "Product ID is required" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, productId: "" }));
    }
  };

  const validateProductName = () => {
    if (!productName.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, productName: "Product Name is required" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, productName: "" }));
    }
  };

  const validatePrice = () => {
    if (!price || price <= 0) {
      setErrors((prevErrors) => ({ ...prevErrors, price: "Price is required and must be positive" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, price: "" }));
    }
  };

  const validateQuantity = () => {
    if (!quantity || quantity <= 0) {
      setErrors((prevErrors) => ({ ...prevErrors, quantity: "Quantity must be greater than 0" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, quantity: "" }));
    }
  };

  const validateCategory = () => {
    if (!category) {
      setErrors((prevErrors) => ({ ...prevErrors, category: "Category is required" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields before making API request
    validateProductId();
    validateProductName();
    validatePrice();
    validateQuantity();
    validateCategory();

    // Check if there are any validation errors
    if (Object.values(errors).some((error) => error)) {
      console.log("Form has errors");
      return; // Don't proceed with the API call if there are errors
    }

    // Send the POST request only if form is valid
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/products`, { productId, productName, price, quantity, category })
      .then((response) => {
        console.log("Product added:", response.data);
        setSuccessMessage("Product successfully added!");
        setErrorMessage(""); // Clear any previous error messages

        // Clear form after submission
        setProductId("");
        setProductName("");
        setPrice("");
        setQuantity("");
        setCategory("");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        setErrorMessage("Failed to add product. Please try again.");
        setSuccessMessage(""); // Clear success message if error occurs
      });
  };

  const isFormValid = () => {
    return (
      productId.trim() &&
      productName.trim() &&
      price > 0 &&
      quantity > 0 &&
      category &&
      !Object.values(errors).some((error) => error)
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#f4f4f4",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ p: 4, bgcolor: "white", borderRadius: 2, boxShadow: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
            Add New Product
          </Typography>

          {/* Display success or error message */}
          {successMessage && (
            <Typography color="success.main" variant="body1" sx={{ textAlign: "center", mb: 2 }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography color="error.main" variant="body1" sx={{ textAlign: "center", mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product ID"
                fullWidth
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                onBlur={validateProductId}
                required
                error={!!errors.productId}
                helperText={errors.productId}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                fullWidth
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                onBlur={validateProductName}
                required
                error={!!errors.productName}
                helperText={errors.productName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={validatePrice}
                required
                error={!!errors.price}
                helperText={errors.price}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onBlur={validateQuantity}
                required
                error={!!errors.quantity}
                helperText={errors.quantity}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onBlur={validateCategory}
                  error={!!errors.category}
                >
                  <MenuItem value="Tshirt">Tshirt</MenuItem>
                  <MenuItem value="Shirt">Shirt</MenuItem>
                  <MenuItem value="Shoes">Shoes</MenuItem>
                  <MenuItem value="Trousers">Trousers</MenuItem>
                  <MenuItem value="Socks">Socks</MenuItem>
                  <MenuItem value="Shorts">Shorts</MenuItem>
                </Select>
                <Typography variant="caption" color="error">
                  {errors.category}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
