// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Ensure environment variables are loaded

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ no longer requires these options as they are default:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Not supported
      // useFindAndModify: false // Not supported
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
