const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


// auth
exports.auth = async(req, res, next) => {
    try {
        // Extract token (can be extracted from req.body, jwt header, cookie-parser can be used to extract data from the cookie)
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");


        console.log("TOKEN in AUTH: ", token);

        // If token is missing then return response
        if(!token) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Token is missing"
                }
            );
        }

        // Verify Token using secret key
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log((payload));

            // add the payload to the req user object(req.user) 
            req.user = payload;
        }

        catch(error) {
            // issue in verification
            return res.status(401).json(
                {
                    success:false,
                    message: "Token is Invalid"
                }
            );
        }

        console.log("in auth: ", req.user);

        next();
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a failed json reponse
        res.status(500).json(
            {
                success: false,
                message: "Internal Servor Error"
            }
        );
    }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        // fetch data one way is to fetch the user role from the payload from the req.user or another way can be access directly from the DB
        if(req.user.accountType !== "Student") {
            return res.status(401).json(
                {
                    success: false,
                    message: "This is a Protected Route for Students Only"
                }
            );
        }

        next();
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a failed json reponse
        res.status(500).json(
            {
                success: false,
                message: "Internal Servor Error"
            }
        );
    }
}

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        // console.log("in Auth middleqare: ", req.user);
        // fetch data one way is to fetch the user role from the payload from the req.user or another way can be access directly from the DB
        if(req.user.accountType !== "Instructor") {
            return res.status(401).json(
                {
                    success: false,
                    message: "This is a Protected Route for Instructors Only"
                }
            );
        }
        
        next();
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a failed json reponse
        res.status(500).json(
            {
                success: false,
                message: "Internal Servor Error"
            }
        );
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        // fetch data one way is to fetch the user role from the payload from the req.user or another way can be access directly from the DB
        if(req.user.accountType !== "Admin") {
            return res.status(401).json(
                {
                    success: false,
                    message: "This is a Protected Route for Admins Only"
                }
            );
        }
        
        next();
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a failed json reponse
        res.status(500).json(
            {
                success: false,
                message: "Internal Servor Error"
            }
        );
    }
}