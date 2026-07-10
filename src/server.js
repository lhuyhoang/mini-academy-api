const express = require("express");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const seedAdmin = require("./utils/seedAdmin");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const logger = require("./middleware/logger");
app.use(logger);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const courseRouter = require("./routes/courseRoutes");
const authRouter = require("./routes/authRoutes");

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);

// Home route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Mini Academy API is running',
        timestamps: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.log('Error occurred:', err);

    const statusCode = err.statusCode || 500;

    const status = err.status || 'error';
    
    res.status(statusCode).json({
        status: status,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Kết nối DB trước khi start server
connectDB().then(async () => {
    await seedAdmin();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`API documentation: http://localhost:${PORT}/api-docs`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Thoát process nếu không kết nối được DB
});