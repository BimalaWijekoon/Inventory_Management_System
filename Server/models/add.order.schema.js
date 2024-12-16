import mongoose from 'mongoose';

// Define OrderItem schema first
const OrderItemSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ['Tshirt', 'Shirt', 'Shoes', 'Trousers', 'Socks', 'Shorts'] },
  color: { type: String, required: true },
  brand: { type: String, required: false }, // Optional based on category
  type: { type: String, required: false }, // Optional for socks
  quantity: { type: Number, required: true, min: 1 },
});

// Define Order schema with timestamps
const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true, match: /^[0-9]{10}$/ }, // Ensures a 10-digit number
  items: [OrderItemSchema], // Array of items in the order
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt`

export default mongoose.model('Order', OrderSchema);
