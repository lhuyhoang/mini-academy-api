const express = require("express");
const router = express.Router();

const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require("../controllers/courseController");
const validateCourseData = require("../middleware/validate");


router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", validateCourseData, createCourse);
router.put("/:id", validateCourseData, updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;