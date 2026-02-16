const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Status Middleware
let dbConnected = false;
app.use((req, res, next) => {
    if (!dbConnected && req.path.startsWith('/api')) {
        return res.status(503).json({
            message: 'Database connection is not established yet. Please check your .env configuration and MongoDB Atlas whitelist.'
        });
    }
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/couplets', require('./routes/coupletRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        database: dbConnected ? 'connected' : 'disconnected'
    });
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
    console.warn('⚠️ WARNING: MONGODB_URI is using placeholder values. Please update your .env file.');
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        dbConnected = true;
        console.log('✅ Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('❌ Error connecting to MongoDB:', err.message);
    });

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
