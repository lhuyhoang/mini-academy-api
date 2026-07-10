const { readCoursesFromFile, writeCourses } = require("../utils/fileHandler");
const AppError = require("../utils/AppError");

const getCourses = async (req, res, next) => {
    try {
        let courses = await readCoursesFromFile();
        if (req.query.price && req.query.price.gte) {
            const gte = Number(req.query.price.gte);
            if (!isNaN(gte)) {
                courses = courses.filter(c => c.price >= gte);
            }
        }

        if (req.query.price && req.query.price.lte) {
            const lte = Number(req.query.price.lte);
            if(!isNaN(lte)) {
                courses = courses.filter(c => c.price <= lte);
            }
        }

        if (req.query.instructor) {
            const instructorQuery = req.query.instructor.toLowerCase().trim();
            courses = courses.filter(c => c.instructor.toLowerCase().includes(instructorQuery));
        }

        if (req.query.sort) {
            if (req.query.sort === 'price') {
                courses.sort((a, b) => a.price - b.price);
            } else if (req.query.sort === '-price') {
                courses.sort((a, b) => b.price - a.price);
            } else if (req.query.sort === 'title') {
                courses.sort((a, b) => a.title.localeCompare(b.title));
            }
        }

        if (req.query.limit) {
            const limit = Number(req.query.limit);
            if(!isNaN(limit) && limit > 0) {
                courses = courses.slice(0, limit);
            }
        }

        res.json({
            status: 'success',
            results: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

const getCourseById = async (req, res, next) => {
    try {
        const courses = await readCoursesFromFile();
        const course = courses.find(c => c.id === Number(req.params.id));
        if (!course) {
            throw new AppError(`Không tìm thấy khóa học với ID ${req.params.id}`, 404);
        }
        res.json({
            status: 'success',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

const createCourse = async (req, res, next) => {
    try {
        const courses = await readCoursesFromFile();
        const maxId = courses.reduce((max, course) => Math.max(max, course.id), 0);
        const newCourse = {
            id: maxId + 1,
            title: req.body.title,
            description: req.body.description || '',
            price: req.body.price,
            instructor: req.body.instructor
        };
        courses.push(newCourse);
        await writeCourses(courses);
        res.status(201).json({
            status: 'success',
            data: newCourse
        });
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const courses = await readCoursesFromFile();
        const index = courses.findIndex(c => c.id === Number(req.params.id));
        if (index === -1) {
            throw new AppError(`Không tìm thấy khóa học với ID ${req.params.id}`, 404);
        }
        if (req.body.title !== undefined) courses[index].title = req.body.title;
        if (req.body.description !== undefined) courses[index].description = req.body.description;
        if (req.body.price !== undefined) courses[index].price = req.body.price;
        if (req.body.instructor !== undefined) courses[index].instructor = req.body.instructor;

        await writeCourses(courses);

        res.json({
            status: 'success',
            data: courses[index]
        });
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        const courses = await readCoursesFromFile();
        const index = courses.findIndex(c => c.id === Number(req.params.id));
        if (index === -1) {
            throw new AppError(`Không tìm thấy khóa học với ID ${req.params.id}`, 404);
        }
        const deletedCourse = courses[index];
        courses.splice(index, 1);
        await writeCourses(courses);
        res.json({
            status: 'success',
            message: `Đã xóa khóa học "${deletedCourse.title}"`,
            data: deletedCourse
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