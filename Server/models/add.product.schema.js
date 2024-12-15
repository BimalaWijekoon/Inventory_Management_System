import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ['Tshirt', 'Shirt', 'Shoes', 'Trousers', 'Socks', 'Shorts'] }, // Added category field with predefined options
});

export default mongoose.model('Product', ProductSchema);
