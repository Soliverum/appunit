const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, AppUnit Backend!');
});

const connectDB = async () => {
  try {
    // Replace with your actual MongoDB connection string (use environment variables in production)
    const mongoURI = 'mongodb://localhost:27017/appunit'; 
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

// Connect to database before starting the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`AppUnit backend listening at http://localhost:${port}`);
  });
});