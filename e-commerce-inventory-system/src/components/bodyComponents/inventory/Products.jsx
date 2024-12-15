import React, { useState, useEffect } from "react";
import Product from "./Product";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function Products() {
  const [allProducts, setAllProducts] = useState([]); // Store all products in an array
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products for display
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState(""); // Store category query

  // Fetch data from the API and store in the array
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        const fetchedProducts = response.data.map((product) => ({
          ...product,
          id: product._id, // Rename _id to id
        }));
        const sortedProducts = mergeSort(fetchedProducts, "productId"); // Sort by productId
        setAllProducts(sortedProducts); // Store sorted data in allProducts
        setFilteredProducts(sortedProducts); // Display initially sorted data
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Merge Sort Implementation
  const mergeSort = (arr, key) => {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), key);
    const right = mergeSort(arr.slice(mid), key);

    return merge(left, right, key);
  };

  const merge = (left, right, key) => {
    const sorted = [];
    while (left.length && right.length) {
      if (left[0][key] <= right[0][key]) {
        sorted.push(left.shift());
      } else {
        sorted.push(right.shift());
      }
    }
    return [...sorted, ...left, ...right];
  };

  // Recursive Binary Search for Product ID
  const binarySearch = (arr, key, value, low = 0, high = arr.length - 1) => {
    if (low > high) return null;

    const mid = Math.floor((low + high) / 2);
    if (arr[mid][key].toString() === value.toString()) {
      return arr[mid];
    } else if (arr[mid][key] > value) {
      return binarySearch(arr, key, value, low, mid - 1);
    } else {
      return binarySearch(arr, key, value, mid + 1, high);
    }
  };

  // Handle search by Product ID or Category
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === "" && categoryQuery === "") {
      setFilteredProducts(allProducts); // Reset to all products
    } else {
      // Filter by Product ID and Category
      const filtered = allProducts.filter(
        (product) =>
          (product.productId.toLowerCase().includes(query.toLowerCase()) ||
            product.productName.toLowerCase().includes(query.toLowerCase())) &&
          (categoryQuery === "" || product.category.toLowerCase().includes(categoryQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryQuery(category);

    // Filter by Product ID and Category
    const filtered = allProducts.filter(
      (product) =>
        (searchQuery === "" || product.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.productName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (category === "" || product.category.toLowerCase().includes(category.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  const columns = [
    { field: "productId", headerName: "Product ID", width: 90 },
    {
      field: "productName",
      headerName: "Product Name",
      width: 400,
      renderCell: (cellData) => <Product productName={cellData.row.productName} />,
    },
    { field: "price", headerName: "Price", width: 150, valueGetter: (params) => "$" + params.row.price },
    { field: "quantity", headerName: "Stock", width: 200, valueGetter: (params) => params.row.quantity + " pcs" },
    { field: "category", headerName: "Category", width: 200 }, // Added Category column
  ];

  return (
    <div>
      {/* Search Box for Product ID */}
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

      {/* Category Dropdown */}
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
        sx={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}
        rows={filteredProducts} // Use filtered products
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
