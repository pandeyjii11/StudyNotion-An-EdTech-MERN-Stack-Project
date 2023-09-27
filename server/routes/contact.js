const express = require("express");
const router = express.Router();

// Import Controllers
const {Contact} = require("../controllers/ContactUs");


// Create Route
router.post("/contact", Contact);


module.exports = router;