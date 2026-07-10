const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Đọc DATABASE_URL từ process.env
        const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/mini-academy';
        
        // Kết nối MongoDB (Mongoose 6+ không cần options cũ)
        await mongoose.connect(DATABASE_URL);
        
        console.log('- Connected to MongoDB successfully!');
        console.log(`- Database: ${mongoose.connection.name}`);
        console.log(`- Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('💥 Please check your DATABASE_URL in .env file');
        // Thoát process với mã lỗi
        process.exit(1);
    }
};

module.exports = connectDB;