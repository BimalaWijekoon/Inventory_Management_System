// routes/product.routes.js

import express from 'express';
import { getProducts, addProduct } from '../controllers/product.controller.js'; // Import controller functions

const router = express.Router();

// Route to get all products
router.get('/', getProducts);

// Route to add a new product
router.post('/', addProduct);

export default router;
