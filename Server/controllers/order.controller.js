import Order from '../models/add.order.schema.js';  // Import the Order model
import mongoose from 'mongoose';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { customerName, mobileNumber, items } = req.body;

    if (!customerName || !mobileNumber || !items || items.length === 0) {
      return res.status(400).json({ message: "Customer name, mobile number, and order items are required." });
    }

    const newOrder = new Order({
      customerName,
      mobileNumber,
      items,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating order" });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching order" });
  }
};

// Update an existing order
export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { customerName, mobileNumber, items } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { customerName, mobileNumber, items },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating order" });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting order" });
  }
};
