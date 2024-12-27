// app.js
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes'); // Import your routes

const app = express();

// Configuration (hardcoded values)
const MONGO_URI = 'mongodb://localhost:27017/';
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process on a critical failure
    });

// Use API routes
app.use('/', apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong! Please try again later.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
