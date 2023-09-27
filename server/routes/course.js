const express = require("express");
const router = express.Router();


// -------------------------------------------------- Import Controllers -----------------------------------------------------//

// Course Controller
const {createCourse, 
    getAllCourses, 
    editCourse, 
    getCourseDetails, 
    getFullCourseDetails, 
    getInstructorCourses, 
    deleteCourse} = require("../controllers/Course");


// import category controllers
const {
    createCategory,
    sowAllCategories, 
    categoryPageDetails
} = require("../controllers/category");


// section controllers
const {
    createSection, 
    updateSection, 
    deleteSection 
} = require("../controllers/Section");


// import the subsection controllers
const {
    createSubSection, 
    updateSubSection, 
    deleteSubSection
} = require("../controllers/Subsection");


// import rating and review controllers
const {
    createRating, 
    getAverageRating, 
    getAllRating
} = require("../controllers/RatingAndReview");



// -------------------------------------------------- Import Middlewares -----------------------------------------------------//

// Import all the middlewares
const {auth, isStudent, isInstructor, isAdmin} = require("../middlewares/auth");



// -------------------------------------------------- Course Routes -----------------------------------------------------//

// Courses can only be created by instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a section
router.put("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection);
// Add a subSection to a section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Update a subsection
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete a subsection
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Specific course Details
router.post("/getCourseDetails", getCourseDetails);
// Get all details of a specific course
router.post("/getFullCourseDetails", auth, isInstructor, getFullCourseDetails);
// edit course
router.put("/editCourse", auth, isInstructor, editCourse);
// Get all course of a sepcific instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Delete a course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

// -------------------------------------------------- Category Routes Only By admin -----------------------------------------------------//

// Create Category
router.post("/createCategory", auth, isAdmin,  createCategory);
// show all Category
router.get("/showAllCategories", sowAllCategories);
// get Category page detils
router.post("/getCategoryPageDetails", categoryPageDetails);

// -------------------------------------------------- Category Routes Only By admin -----------------------------------------------------//

// Create rating and review
router.post("/createRating", auth, isStudent, createRating);
// get average rating
router.get("/getAverageRating", getAverageRating);
// get all Reviews and Ratings
router.get("/getReviews", getAllRating);


// Export The Router
module.exports = router;