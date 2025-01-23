import React, { useState, useEffect } from "react";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { mergeSort } from "./sorting"; // Import mergeSort

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [sortKey, setSortKey] = useState(""); // Key to sort by

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      const orderResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`);

      const products = productResponse.data.map((product) => ({
        ...product,
        id: product._id, // Assign a unique `id` for DataGrid
      }));
      const updatedProducts = adjustProductQuantities(products, orderResponse.data.orders);

      setAllProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterProducts(query, categoryQuery, sortKey);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryQuery(category);
    filterProducts(searchQuery, category, sortKey);
  };

  const handleSortChange = (e) => {
    const key = e.target.value;
    setSortKey(key);
    filterProducts(searchQuery, categoryQuery, key);
  };

  const filterProducts = (search, category, sortKey) => {
    let filtered = allProducts.filter(
      (product) =>
        (product.productId.toLowerCase().includes(search) ||
          product.productName.toLowerCase().includes(search)) &&
        (category === "" || product.category === category)
    );

    if (sortKey) {
      filtered = mergeSort(filtered, (a, b) => {
        if (a[sortKey] < b[sortKey]) return -1;
        if (a[sortKey] > b[sortKey]) return 1;
        return 0;
      });
    }

    setFilteredProducts(filtered);
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

      {/* Sort Options */}
      <select
        value={sortKey}
        onChange={handleSortChange}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "200px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <option value="">Sort By</option>
        <option value="productName">Name</option>
        <option value="price">Price</option>
        <option value="quantity">Stock</option>
      </select>

      {/* Data Grid */}
      <DataGrid
        rows={filteredProducts}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}
