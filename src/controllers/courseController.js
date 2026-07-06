const { readCoursesFromFile, writeCourses } = require("../utils/fileHandler");

const getCourses = async (req, res, next) => {
    try {
        const courses = await readCoursesFromFile();
        res.json({
            status: 'success',
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

const createCourse = async (req, res, next) => {
    try {
        console.log('req.body:', req.body);
        const courses = await readCoursesFromFile();
        const maxId = courses.reduce((max, course) => Math.max(max, course.id), 0);
        const newId = maxId + 1;
        const newCourse = {
            id: newId,
            title: req.body.title,
            description: req.body.description,
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

module.exports = {
    getCourses,
    createCourse
}; 