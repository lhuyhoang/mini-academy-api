const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = 'uploads/courses/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError(`Chỉ chấp nhận file ảnh (${allowedTypes.join(', ')})`, 400), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Chỉ cho phép upload 1 file
    }
});

module.exports = upload;