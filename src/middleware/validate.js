const AppError = require('../utils/AppError');

const validateCourseData = (req, res, next) => {
    let { title, price, instructor, description } = req.body;

    if (price !== undefined && price !== null) {
        price = Number(price);
        req.body.price = price;
    }
    
    // Kiểm tra title
    if (!title) {
        throw new AppError('Title là bắt buộc', 400);
    }
    if (typeof title !== 'string') {
        throw new AppError('Title phải là chuỗi ký tự', 400);
    }
    if (title.trim().length === 0) {
        throw new AppError('Title không được để trống', 400);
    }
    if (title.trim().length < 3) {
        throw new AppError('Title phải có ít nhất 3 ký tự', 400);
    }
    
    // Kiểm tra price
    if (price === undefined || price === null) {
        throw new AppError('Price là bắt buộc', 400);
    }
    if (typeof price !== 'number' || isNaN(price)) {
        throw new AppError('Price phải là số', 400);
    }
    if (price <= 0) {
        throw new AppError('Price phải lớn hơn 0', 400);
    }
    
    // Kiểm tra instructor
    if (!instructor) {
        throw new AppError('Instructor là bắt buộc', 400);
    }
    if (typeof instructor !== 'string') {
        throw new AppError('Instructor phải là chuỗi ký tự', 400);
    }
    if (instructor.trim().length === 0) {
        throw new AppError('Instructor không được để trống', 400);
    }
    
    // Nếu có description, kiểm tra type
     if (description && typeof description !== 'string') {
        throw new AppError('Description phải là chuỗi ký tự', 400);
    }
    
    // Nếu có file upload, kiểm tra file
    if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new AppError('File upload phải là ảnh (jpeg, png, gif, webp)', 400);
        }
        
        // Kiểm tra kích thước file (tối đa 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file.size > maxSize) {
            throw new AppError('Kích thước ảnh không được vượt quá 5MB', 400);
        }
    }
    
    next();
};

module.exports = validateCourseData;