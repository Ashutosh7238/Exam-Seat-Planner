const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── API Routes ──
app.use('/api/classrooms', require('./routes/classroomRoutes'));
app.use('/api/allocation', require('./routes/allocationRoutes'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
message: 'Server is up and running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Error Handling Middleware (must be last) ──
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
