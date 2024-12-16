import express from 'express';
import { 
  getProducts, 
  addProduct, 
  getTotalProductValue 
} from '../controllers/product.controller.js'; // Import controller functions

const router = express.Router();

// Routes for product operations
router
  .get('/', getProducts)              // GET /api/products - Retrieve all products
  .post('/', addProduct)              // POST /api/products - Add a new product
  .get('/total-value', getTotalProductValue); // GET /api/products/total-value - Get total product value

export default router;
