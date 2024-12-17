import React, { useState, useEffect } from "react";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function Products() {
  const [allProducts, setAllProducts] = useState([]); // All products state
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products for display
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products and orders
  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get("http://localhost:5000/api/products");
      const orderResponse = await axios.get("http://localhost:5000/api/orders");

      const products = productResponse.data.map((product) => ({
        ...product,
        id: product._id,
      }));
      const updatedProducts = adjustProductQuantities(products, orderResponse.data.orders);

      setAllProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Adjust product stock based on orders
  const adjustProductQuantities = (products, orders) => {
    const updatedProducts = [...products];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = updatedProducts.find((p) => p.productName === item.productName);
        if (product) {
          product.quantity -= item.quantity;
          if (product.quantity < 0) product.quantity = 0; // Prevent negative stock
        }
      });
    });

    return updatedProducts;
  };

  // Search and filter functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterProducts(query, categoryQuery);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value.toLowerCase();
    setCategoryQuery(category);
    filterProducts(searchQuery, category);
  };

  const filterProducts = (search, category) => {
    const filtered = allProducts.filter(
      (product) =>
        (product.productId.toLowerCase().includes(search) ||
          product.productName.toLowerCase().includes(search)) &&
        (category === "" || product.category.toLowerCase().includes(category))
    );
    setFilteredProducts(filtered);
  };

  // Simulate order placement and update state
  const handleOrderPlaced = (newOrder) => {
    const updatedProducts = [...allProducts];

    newOrder.items.forEach((item) => {
      const product = updatedProducts.find((p) => p.productName === item.productName);
      if (product) {
        product.quantity -= item.quantity;
        if (product.quantity < 0) product.quantity = 0; // Prevent negative stock
      }
    });

    setAllProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const columns = [
    { field: "productId", headerName: "Product ID", width: 90 },
    {
      field: "productName",
      headerName: "Product Name",
      width: 300,
      renderCell: (cellData) => <Product productName={cellData.row.productName} />,
    },
    { field: "price", headerName: "Price", width: 150, valueGetter: (params) => "$" + params.row.price },
    { field: "quantity", headerName: "Stock", width: 150, valueGetter: (params) => params.row.quantity + " pcs" },
    { field: "category", headerName: "Category", width: 150 },
  ];

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Product ID or Name"
        value={searchQuery}
        onChange={handleSearch}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "300px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Category Filter */}
      <select
        value={categoryQuery}
        onChange={handleCategoryChange}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "200px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="">All Categories</option>
        <option value="Tshirt">T-shirt</option>
        <option value="Shirt">Shirt</option>
        <option value="Shoes">Shoes</option>
        <option value="Trousers">Trousers</option>
        <option value="Socks">Socks</option>
        <option value="Shorts">Shorts</option>
      </select>

      {/* Data Grid */}
      <DataGrid
        rows={filteredProducts}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
      />

      {/* Simulate Order Placement */}
      <button
        onClick={() =>
          handleOrderPlaced({
            items: [{ productName: "T-shirt", quantity: 2 }],
          })
        }
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Simulate Order Placement
      </button>
    </div>
  );
}
