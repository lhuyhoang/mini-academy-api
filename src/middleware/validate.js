const AppError = require('../utils/appError');

const validateCourseData = (req, res, next) => {
    const { title, description, price, instructor } = req.body;

    if(!title) {
        throw new AppError('Title là bắt buộc', 400);
    }
    if(typeof title !== 'string') {
        throw new AppError('Title phải là một chuỗi', 400);
    }
    if(title.trim().length === 0) {
        throw new AppError('Title không được để trống', 400);
    }
    if(price === undefined || price === null) {
        throw new AppError('Price là bắt buộc', 400);
    }
    if(typeof price !== 'number') {
        throw new AppError('Price phải là một số', 400);
    }
    if(price <= 0) {
        throw new AppError('Price phải là một số dương', 400);
    }
    if(!Number.isFinite(price)) {
        throw new AppError('Price phải là một số hữu hạn', 400);
    }
    if(description !== undefined && typeof description !== 'string') {
        throw new AppError('Description phải là một chuỗi', 400);
    }
    if(!instructor) {
        throw new AppError('Instructor là bắt buộc', 400);
    }
    if(typeof instructor !== 'string') {
        throw new AppError('Instructor phải là một chuỗi', 400);
    }
    if(instructor.trim().length === 0) {
        throw new AppError('Instructor không được để trống hoặc chỉ chứa khoảng trắng', 400);
    }
    next();
};

module.exports = validateCourseData;