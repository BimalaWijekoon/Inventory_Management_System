import React, { useState } from "react";
import { Box, Button, TextField, Typography, Select, MenuItem, InputLabel, FormControl, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const AddOrder = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const categories = ["Tshirt", "Shirt", "Shoes", "Trousers", "Socks", "Shorts"];

  const categoryDetails = {
    Tshirt: {
      colors: ["Red", "Blue", "Green", "Black"],
      brands: ["Nike", "Adidas", "Puma"]
    },
    Shirt: {
      colors: ["White", "Blue", "Grey", "Black"],
      brands: ["Linen", "Cotton"]
    },
    Shoes: {
      colors: ["Black", "White", "Grey", "Brown"],
      brands: ["Nike", "Adidas", "Boots", "Leather"]
    },
    Trousers: {
      colors: ["Beige", "Black", "Blue", "Grey"],
      brands: []
    },
    Socks: {
      colors: ["White", "Black", "Grey", "Blue"],
      types: ["Low Cut", "Anklets", "Mid Calf"]
    },
    Shorts: {
      colors: ["Blue", "Grey", "Black", "Green"],
      brands: []
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { category: "", color: "", brand: "", type: "", quantity: 1 }
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous errors
    setError("");

    
    try {
      const response = await axios.post("http://localhost:5000/api/orders", {
        customerName,
        mobileNumber,
        items,
      });
      console.log("Order Submitted: ", response.data);
      alert("Order submitted successfully!");
      // Reset form after successful submission
      setCustomerName("");
      setMobileNumber("");
      setItems([]);
      navigate("/orders"); // Navigate to the orders page on successful submission
    } catch (error) {
      console.error("Error submitting order: ", error);
      setError("There was an error submitting the order. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        margin: 3,
        padding: 3,
        bgcolor: "white",
        borderRadius: 2,
        maxWidth: 900,
        maxHeight: 1100,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Add New Order
      </Typography>

      {error && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
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

        <Box sx={{ my: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Add Items to Your Order
          </Typography>
          {items.map((item, index) => (
            <Box key={index} sx={{ border: "1px solid #ccc", padding: 2, marginBottom: 2 }}>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={item.category}
                  onChange={(e) => handleItemChange(index, "category", e.target.value)}
                  label="Category"
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {item.category && (
                <>
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={item.color}
                      onChange={(e) => handleItemChange(index, "color", e.target.value)}
                      label="Color"
                      required
                    >
                      {categoryDetails[item.category]?.colors?.map((col) => (
                        <MenuItem key={col} value={col}>
                          {col}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {categoryDetails[item.category]?.brands?.length > 0 && (
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                      <InputLabel>Brand</InputLabel>
                      <Select
                        value={item.brand}
                        onChange={(e) => handleItemChange(index, "brand", e.target.value)}
                        label="Brand"
                      >
                        {categoryDetails[item.category]?.brands.map((br) => (
                          <MenuItem key={br} value={br}>
                            {br}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {item.category === "Socks" && (
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={item.type}
                        onChange={(e) => handleItemChange(index, "type", e.target.value)}
                        label="Type"
                      >
                        {categoryDetails.Socks.types.map((ty) => (
                          <MenuItem key={ty} value={ty}>
                            {ty}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  <TextField
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    required
                    inputProps={{ min: 1 }}
                    sx={{ marginBottom: 2 }}
                  />
                </>
              )}

              <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
                <IconButton
                  onClick={() => handleRemoveItem(index)}
                  color="error"
                  sx={{ marginRight: 1 }}
                >
                  <DeleteIcon />
                  <Typography variant="body2">Delete</Typography>
                </IconButton>
              </Box>
            </Box>
          ))}

          <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddItem}
              disabled={!customerName || !mobileNumber}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" type="submit">
            Confirm Order
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddOrder;
