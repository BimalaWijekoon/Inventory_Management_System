import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },

});

export default mongoose.model('Product', ProductSchema);
