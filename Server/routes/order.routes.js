import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

// Define routes relative to `/api/orders`
router.post('/', createOrder);         // POST /api/orders
router.get('/', getAllOrders);         // GET /api/orders
router.get('/:id', getOrderById);      // GET /api/orders/:id
router.put('/:id', updateOrder);       // PUT /api/orders/:id
router.delete('/:id', deleteOrder);    // DELETE /api/orders/:id

export default router;
