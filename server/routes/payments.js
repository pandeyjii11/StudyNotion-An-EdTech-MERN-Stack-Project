const express = require("express");
const router = express.Router();


// ------------------------------------------- Import the Controllers ------------------------------------------------ //

// Import the payments controller 
const {capturePayment, verifyPayment, sendPaymetSuccessEmail} = require("../controllers/Payments");




// -------------------------------------------------- import Middlewares -----------------------------------------------------//

const {auth, isStudent, isInstructor, isAdmin} = require("../middlewares/auth");


// -------------------------------------------------- Create Routes for Payments -----------------------------------------------------//

// Capture Payments
router.post("/capturePayment", auth, isStudent, capturePayment);
// Varify Payment Signature
router.post("/verifyPayment", auth, isStudent, verifyPayment);
// Send Successful email
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymetSuccessEmail);


// -------------------------------------------------- Export Router ----------------------------------------------------- //

module.exports = router;