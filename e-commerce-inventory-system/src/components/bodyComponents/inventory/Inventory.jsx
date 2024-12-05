import { Grid, Box, Typography, Button } from "@mui/material";
import React, { Component } from "react";
import Products from "./Products";
import Overview from "./Overview";
import { Link } from "react-router-dom";  // Import Link for navigation

export default class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Box>
        <Grid container sx={{ mx: 3, p: 3 }}>
          <Grid item md={9}>
            <Box
              sx={{
                margin: 4,
                bgcolor: "white",
                borderRadius: 2,
                padding: 3,
                height: "100%",
              }}
            >
              <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
                Inventory
              </Typography>
              {/* Button placed on the right side */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
                <Link to="/add-product"> {/* Link to Add Product page */}
                  <Button variant="contained" color="primary">
                    + Add Product
                  </Button>
                </Link>
              </Box>
              <Products />
            </Box>
          </Grid>
          <Grid item md={3}>
            <Box
              sx={{
                margin: 3,
                bgcolor: "white",
                borderRadius: 2,
                padding: 3,
                height: "100%",
              }}
            >
              <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
                Overview
              </Typography>
              <Overview />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
