// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // <--- ADD THIS
const swaggerUi = require('swagger-ui-express'); // <--- ADD
const swaggerSpec = require('./swaggerConfig'); // <--- ADD

// const bodyParser = require('body-parser'); // No longer strictly needed for JSON/URLencoded

// Load env vars
dotenv.config();

// Connect to Database
connectDB(); // <--- ADD THIS

const app = express();

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

// Swagger UI Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // <--- ADD THIS

// Basic Route
app.get('/', (req, res) => {
  res.send('AppUnit API Running...');
});

// Placeholder for future routes
// Example: app.use('/api/v1/projects', require('./routes/projectRoutes'));
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes'); // <--- ADD THIS

app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/auth', authRoutes); // <--- ADD THIS

const PORT = process.env.PORT || 5000; // Fallback port

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
