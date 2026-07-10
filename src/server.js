const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const logger = require("./middleware/logger");
app.use(logger);

const courseRouter = require("./routes/courseRoutes");

app.use("/api/courses", courseRouter);

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Mini Academy API is running',
        timestamps: new Date().toISOString()
    });
});

app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

app.use((err, req, res, next) => {
    console.log('Error occurred:', err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API documentation: http://localhost:${PORT}/api-docs`);
});