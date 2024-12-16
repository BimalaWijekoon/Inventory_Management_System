import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS package
import productRoutes from './routes/product.routes.js'; // Import product routes
import orderRoutes from './routes/order.routes.js'; // Import order routes


dotenv.config();

const app = express(); // Define app first
const PORT = process.env.PORT || 5000;

// Middleware to handle CORS
app.use(cors()); // Apply CORS middleware here

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://ravi2001730:IEjMulQAP05aTN4q@cluster0.3qjef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Add this line for order routes


// Sample Route
app.get('/', (req, res) => {
  res.send('Welcome to the Inventory Management System API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
