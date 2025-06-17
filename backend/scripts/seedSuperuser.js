const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user'); // Assuming your User model is here

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/appunit'; // Use environment variable or default

const superuserData = {
  name: 'Soliverum',
  email: 'soliverum@gmail.com',