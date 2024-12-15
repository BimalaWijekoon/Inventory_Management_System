import Product from '../models/add.product.schema.js';

// Add a new product
export const addProduct = async (req, res) => {
  const { productId, productName, price, quantity, category } = req.body;

  try {
    const newProduct = new Product({ productId, productName, price, quantity, category }); // Added category here
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productId, productName, price, quantity, category } = req.body; // Added category here

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { productId, productName, price, quantity, category }, // Added category here
      { new: true } // Return updated document
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
// Calculate the total value of products in inventory
export const getTotalProductValue = async (req, res) => {
  try {
    const products = await Product.find(); // Get all products

    // Log the fetched products to check the structure and types
    console.log("Fetched Products:", products);

    const totalValue = products.reduce((sum, product) => {
      // Ensure price and quantity are treated as numbers
      const price = Number(product.price);  // Explicitly convert to number
      const quantity = Number(product.quantity);  // Explicitly convert to number
      console.log(`Product: ${product.productName}, Price: ${price}, Quantity: ${quantity}`);  // Log individual values

      return sum + (price * quantity); // Calculate value
    }, 0);

    console.log("Total Product Value:", totalValue);

    res.status(200).json({ totalProductValue: totalValue });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total product value', error });
  }
};



