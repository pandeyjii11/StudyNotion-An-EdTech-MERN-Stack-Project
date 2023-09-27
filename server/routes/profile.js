const express = require("express");
const router = express.Router();

// ----------------------------------------------- Import the Controllers ---------------------------------//

const {updateProfile, deleteAccount, getAllUserDetails, getEnrolledCourses, instructorDashboard, updateDisplayPicture} = require("../controllers/Profile");

// ---------------------------------------------- Import the Middlewares ----------------------------------- //
const {auth, isInstructor} = require("../middlewares/auth");


// ------------------------------------------------ Create profile Routes ----------------------------------//

// Update Profile
router.put("/updateProfile", auth, updateProfile);
// Delete Account
router.delete("/deleteProfile", auth, deleteAccount);
// Get all user details
router.get("/getUserDetails", auth, getAllUserDetails);
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
// Get Instructor dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);
// Update Display Picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);


module.exports = router;