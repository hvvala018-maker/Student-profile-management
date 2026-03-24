const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const studentRoutes = require('./Routes/studentRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Serve uploaded files statically with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        // Allow cross-origin access to files
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    }
}));

// MongoDB Connection Options:
// Using MongoDB Atlas
const ATLAS_URI = "mongodb://hvvala018:hetviatlas@ac-cjf8q0s-shard-00-00.5m3lfav.mongodb.net:27017,ac-cjf8q0s-shard-00-01.5m3lfav.mongodb.net:27017,ac-cjf8q0s-shard-00-02.5m3lfav.mongodb.net:27017/Student_db?ssl=true&replicaSet=atlas-bw6rqt-shard-0&authSource=admin&appName=Cluster0";

// Database Connection
mongoose.connect(ATLAS_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch(err => {
        console.error('❌ Database Connection Error:');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        console.error('Full Error:', err);
    });

// Routes setup
app.use('/api/students', studentRoutes);

// Server Listen
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});