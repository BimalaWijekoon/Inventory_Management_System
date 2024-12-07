import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid, Container, FormHelperText } from "@mui/material";

export default function AddProduct() {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [errors, setErrors] = useState({
    productId: "",
    productName: "",
    price: "",
    quantity: "",
  });

  // Validate Product ID
  const validateProductId = () => {
    if (!productId.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, productId: "Product ID is required" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, productId: "" }));
    }
  };

  // Validate Product Name
  const validateProductName = () => {
    if (!productName.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, productName: "Product Name is required" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, productName: "" }));
    }
  };

  // Validate Price
  const validatePrice = () => {
    if (!price || price <= -1) {
      setErrors((prevErrors) => ({ ...prevErrors, price: "Price is required " }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, price: "" }));
    }
  };

  // Validate Quantity
  const validateQuantity = () => {
    if (!quantity || quantity <= 0) {
      setErrors((prevErrors) => ({ ...prevErrors, quantity: "Quantity must be more than 1" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, quantity: "" }));
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    validatePrice();
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);
    validateQuantity();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateProductId();
    validateProductName();
    validatePrice();
    validateQuantity();

    // Check if there are any validation errors
    if (Object.values(errors).some((error) => error)) {
      console.log("Form has errors");
      return;
    }

    // If no errors, submit the product details (can integrate with API or backend)
    console.log({
      productId,
      productName,
      price,
      quantity,
    });

    // Clear the form after successful submission
    setProductId("");
    setProductName("");
    setPrice("");
    setQuantity("");
  };

  const isFormValid = () => {
    return (
      productId.trim() &&
      productName.trim() &&
      price > 0 &&
      quantity > 0 &&
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
          <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
            Add New Product
          </Typography>
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
                onChange={handlePriceChange}
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
                onChange={handleQuantityChange}
                onBlur={validateQuantity}
                required
                error={!!errors.quantity}
                helperText={errors.quantity}
                inputProps={{ min: 1 }}
              />
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
