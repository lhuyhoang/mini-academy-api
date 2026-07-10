const express = require('express');
const router = express.Router();
const { 
    getCourses, 
    getCourseById, 
    createCourse, 
    updateCourse, 
    deleteCourse 
} = require('../controllers/courseController');
const validateCourseData = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", protect, authorize('admin'), upload.single('thumbnail'), validateCourseData, createCourse);
router.put("/:id", protect, authorize('admin'), upload.single('thumbnail'), validateCourseData, updateCourse);
router.delete("/:id", protect, authorize('admin'), deleteCourse);

module.exports = router;