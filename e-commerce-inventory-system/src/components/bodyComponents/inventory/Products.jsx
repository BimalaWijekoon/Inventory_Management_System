import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products") // Replace with the correct API endpoint
      .then((response) => {
        // Map the fetched products and rename _id to id
        const fetchedProducts = response.data.map((product) => ({
          ...product, // Spread the rest of the product properties
          id: product._id, // Rename _id to id
        }));
        setProducts(fetchedProducts); // Set the renamed products
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const columns = [
    {
      field: "productId",
      headerName: "Product ID",
      width: 90,
      description: "ID of the product",
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 400,
      description: "",
      renderCell: (cellData) => {
        return <Product productName={cellData.row.productName} />;
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      description: "Price of the product",
      valueGetter: (params) => "$" + params.row.price,
    },
    {
      field: "quantity",
      headerName: "Stock",
      width: 200,
      description: "How many items in stock",
      valueGetter: (params) => params.row.quantity + " pcs",
    },
  ];

  return (
    <div>
      <DataGrid
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={products} // Use the renamed product list
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
      />
    </div>
  );
}
