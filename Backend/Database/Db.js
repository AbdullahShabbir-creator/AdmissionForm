const mongoose = require('mongoose');

// MongoDB connection string (replace with your own URI if using MongoDB Atlas)
const MONGO_URI = 'mongodb://localhost:27017/admissionDB'; 

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
