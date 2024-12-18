import mongoose from 'mongoose';

// Define OrderItem schema
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

// Define Order schema with customer details and items array
const OrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Ensures a 10-digit number
    },
    items: [OrderItemSchema], // Array of items in the order
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

export default mongoose.model('Order', OrderSchema);
