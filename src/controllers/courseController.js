const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const fs = require('fs').promises;
const path = require('path');

const getCourses = async (req, res, next) => {
    try {
        const queryObj = {};
        if (req.query.search) {
            queryObj.$text = { $search: req.query.search };
        }

        if (req.query.price && req.query.price.gte) {
            const gte = Number(req.query.price.gte);
            if (!isNaN(gte)) queryObj.price = { ...queryObj.price, $gte: gte };
        }
        if (req.query.price && req.query.price.lte) {
            const lte = Number(req.query.price.lte);
            if (!isNaN(lte)) queryObj.price = { ...queryObj.price, $lte: lte };
        }
        if (req.query.instructor) {
            queryObj.instructor = { $regex: req.query.instructor, $options: 'i' };
        }

        const page = Math.abs(parseInt(req.query.page)) || 1;
        const limit = Math.abs(parseInt(req.query.limit)) || 10;
        const skip = (page - 1) * limit;
        const total = await Course.countDocuments(queryObj);

        let sortObj = { createdAt: -1 };
        if (req.query.sort === 'price') sortObj = { price: 1 };
        else if (req.query.sort === '-price') sortObj = { price: -1 };
        else if (req.query.sort === 'title') sortObj = { title: 1 };
        else if (req.query.sort === '-title') sortObj = { title: -1 };

        let query = Course.find(queryObj);
        if (req.query.search) {
            query = query.select({ score: { $meta: 'textScore' } });
            if (!req.query.sort) sortObj = { score: { $meta: 'textScore' } };
        }

        const courses = await query.sort(sortObj).skip(skip).limit(limit);
        res.json({ status: 'success', results: courses.length, total, page, totalPages: Math.ceil(total / limit), data: courses });
    } catch (error) {
        next(error);
    }
};

const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) throw new AppError(`Không tìm thấy khóa học với ID ${req.params.id}`, 404);
        res.json({ status: 'success', data: course });
    } catch (error) {
        next(error);
    }
};

const createCourse = async (req, res, next) => {
    try {
        const courseData = { ...req.body };
        
        // Nếu có file upload
        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            courseData.thumbnail = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
        }
        
        const newCourse = await Course.create(courseData);
        
        res.status(201).json({
            status: 'success',
            data: newCourse
        });
    } catch (error) {
        // Nếu có lỗi và đã upload file, xóa file đi
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        // Nếu có file upload mới và course cũ có thumbnail, xóa thumbnail cũ
        if (req.file) {
            const oldCourse = await Course.findById(req.params.id);
            if (oldCourse && oldCourse.thumbnail) {
                // Lấy đường dẫn file từ URL
                const oldFilePath = oldCourse.thumbnail.replace(/^https?:\/\/[^\/]+\//, '');
                const fullPath = path.join(__dirname, '..', oldFilePath);
                
                try {
                    await fs.unlink(fullPath);
                } catch (err) {
                    console.log('Old thumbnail not found, skipping delete');
                }
            }
            
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            req.body.thumbnail = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
        }
        
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!course) {
            // Nếu không tìm thấy course và có file upload, xóa file
            if (req.file) {
                try {
                    await fs.unlink(req.file.path);
                } catch (unlinkError) {
                    console.error('Error deleting file:', unlinkError);
                }
            }
            throw new AppError(`Không tìm thấy khóa học với ID ${req.params.id}`, 404);
        }
        
        res.json({
            status: 'success',
            data: course
        });
    } catch (error) {
        // Nếu có lỗi và đã upload file, xóa file
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        
        if (!course) {
            throw new AppError(`Không tìm thấy khóa học với ID ${req.params.id}`, 404);
        }

        if (course.thumbnail) {
            const filePath = course.thumbnail.replace(/^https?:\/\/[^\/]+\//, '');
            const fullPath = path.join(__dirname, '..', filePath);
            
            try {
                await fs.unlink(fullPath);
                console.log(`Deleted thumbnail: ${fullPath}`);
            } catch (err) {
                console.log('Thumbnail not found, skipping delete');
            }
        }
        
        res.json({
            status: 'success',
            message: `Đã xoá khóa học "${course.title}"`,
            data: course
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};