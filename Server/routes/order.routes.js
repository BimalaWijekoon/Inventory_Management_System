import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/orders', createOrder);         // Create a new order
router.get('/orders', getAllOrders);         // Get all orders
router.get('/orders/:id', getOrderById);    // Get a specific order by ID
router.put('/orders/:id', updateOrder);     // Update an order
router.delete('/orders/:id', deleteOrder);  // Delete an order

export default router;
