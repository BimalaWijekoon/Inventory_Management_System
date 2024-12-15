import express from 'express';
import { getProducts, addProduct, getTotalProductValue } from '../controllers/product.controller.js'; // Import controller functions

const router = express.Router();

// Route to get all products
router.get('/', getProducts);

// Route to add a new product
router.post('/', addProduct);

// Route to get total product value
router.get('/total-value', getTotalProductValue);


export default router;
