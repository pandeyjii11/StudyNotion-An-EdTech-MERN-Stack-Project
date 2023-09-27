const express = require("express");
const router = express.Router();

// ------------------------------------------ Import the Controllers -----------------------------//

// Import the auth controllers
const {sendOTP, signUp, login, changePassword} = require("../controllers/Auth");

// import the reset Passord controllers
const {resetpasswordToken, resetpassword} = require("../controllers/ResetPassword");



//  -------------------------------------- Import the Middlewares ------------------------------------//

const {auth} = require("../middlewares/auth");
const { route } = require("./course");


// --------------------------------------- create authentication routes(login or signup) ----------------------//

// Login user
router.post("/login", login);
// Signup User
router.post("/signup", signUp);
// send Otp to user email
router.post("/sendotp", sendOTP);
// change Password
router.post("/changepassword", auth, changePassword);


//  ----------------------------------------- Resegt Password Route ------------------------------------// 

// Generate a resetpassword token
router.post("/reset-password-token", resetpasswordToken);
// Rsest Password 
router.post("/reset-password", resetpassword);


// -------------------------------------------------------- Export router ------------------------------------- //

module.exports = router;