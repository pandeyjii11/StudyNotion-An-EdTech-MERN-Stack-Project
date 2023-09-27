const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// Send OTP
exports.sendOTP = async(req, res) => {
    try {
        // fetch user email from req.body
        const {email} = req.body;

        // Check if useralready exist
        const checkUser = await User.findOne({email});

        // if user is already exists return a response
        if(checkUser)
        {
            return res.status(401).json(
                {
                    success: false,
                    message: "User already Exists"
                }
            );
        }

        // generate otp of length 6
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        console.log("OTP Generated: ", otp);

        // Check if otp generated is unique or not
        let result = await OTP.findOne({otp: otp});

        // Check until unique otp and keep on generating otp
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });

            result = await OTP.findOne({otp: otp});
        }

        // Enter the otp generated into the DB that is create an entry into the DB of the generated OTP
        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log("otp body: ", otpBody);

        // Send a successfuk json response
        res.status(200).json(
            {
                success: true,
                message: "Otp Sent Successfully"
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error occured: ", err.message);

        // Send a json rsponse with failed flag
        res.status(500).json(
            {
                success: false,
                data: "Internal Server Failure",
                message: err.message
            }
        );
    }
}


// Signup
exports.signUp = async(req, res) => {
    try {
        // Fetch data from the req.body
        const {firstName, lastName, email, password, confirmPassword, accountType, conatctNumber, otp} = req.body;

        console.log("otp", otp);
        // console.log(lastName);

        // validate the user details and the password
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json(
                {
                    success: false,
                    message: "All fields are Required"
                }
            );
        }

        // validate if confirmPssword and Password match or not
        if(password !== confirmPassword)
        {
            return res.status(400).json(
                {
                    success: false,
                    message: "Password do not Match"
                }
            );
        }

        // Check if user already exixts
        const existingUser = await User.findOne({email});

        // if already exists
        if(existingUser)
        {
            return res.status(400).json(
                {
                    success: false,
                    message: "User Already Exixts"
                }
            );
        }

        // Find most recent OTP generated for the user
        // Query to find the most recent OTP for the current user if mutiple entry for the user 
        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1)
        

        // Validate OTP
        if(recentOTP.length === 0) {
            // OTP not found
            return res.status(404).json(
                {
                    success: false,
                    message: "OTP not Found"
                }
            );
        }
        
        else if(otp != recentOTP[0].otp) {
            // console.log("recentOtp: ", recentOTP[0].otp);
            return res.status(400).json(
                {
                    success: false,
                    messgae: "OTP do not match"
                }
            );
        }

        // hashing(encrypting) password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create an entry into the DATABASE
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            aboout: null,
            conatctNumber: null,
        });

        const user = await User.create({
            firstName, 
            lastName, 
            email, 
            password:hashedPassword, 
            accountType: accountType, 
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // retutn a success json respnse
        return res.status(200).json(
            {
                success:true,
                message: "Account Created Successfull",
                user
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error occured: ", err.message);

        // Send a json rsponse with failed flag
        res.status(500).json(
            {
                success: false,
                data: "Internal Server Failure",
                message: err.message
            }
        );
    }
}


// Login
exports.login = async (req, res) => {
    try {
        // Fetch data from req.body
        const {email, password} = req.body;

        // valiodate data
        if(!email || !password) {
            return res.status(403).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            );
        }

        // check user exists or not validate user
        const user = await User.findOne({email}).populate("additionalDetails");
        
        // If user not present
        if(!user)
        {
            return res.status(404).json(
                {
                    success: false,
                    message: "User Not Found, please SignUp"
                }
            );
        }

        // if user present then validate the password
        // if password match
        if(await bcrypt.compare(password, user.password)) {
            // generate Token

            const payload = {
                email: user.email,
                accountType: user.accountType,
                id: user._id
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });

            // Pass the token generated into the user object
            user.token = token;
            user.password = undefined;

            // generate cookie
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), //expires in 3 days from the time of creation
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json(
                {
                    success: true,
                    messgae: "User Login Successful",
                    token,
                    user
                }
            );
        }
        // if password do not match
        else {
            res.status(401).json(
                {
                    success: false,
                    message: "Password is Incorrect"
                }
            );
        }
    }
    catch(err) {
        console.error(err);
        console.log("Error occured: ", err.message);

        // Send a json rsponse with failed flag
        res.status(500).json(
            {
                success: false,
                data: "Internal Server Failure",
                message: err.message
            }
        );
    }
}


// Change Password
exports.changePassword = async(req, res) => {
    try {
        // Fetch user data from the req.user which was inerted into the req at the time of user authentication which conatins the payload which has user id
        const userId = req.user.id;

        // fetch Data from the req.body
        const {oldPassword, newPassword} = req.body;

        // Validate data
        if(!oldPassword || !newPassword ) {
            return res.status(400).json(
                {
                    success: false,
                    message: "All fields are Required"
                }
            );
        }

        // Get user
        const user = await User.findById(userId);

        // Validate User
        if(!user) {
            res.status(404).json(
                {
                    success: false,
                    message: "User Not Found, Please Register"
                }
            );
        }

        // match the old password
        if(!await bcrypt.compare(oldPassword, user.password))
        {
            return res.status(400).json(
                {
                    success: false, 
                    message: "Old Password do not match"
                }
            );
        }

        // Hash(encryp) the new Password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // save the entry into the DB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                password: hashedPassword
            },
            {
                new: true
            }
        );

        // Send a mail
        await mailSender(updatedUser.email, "Password Updated!", `Password Updated Successfully for the user ${updatedUser.firstName} ${updatedUser.lastName}`);

        // send a json response
        res.status(200).json(
            {
                success: true,
                message: "Passord Updated Successfully"
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error occured: ", err.message);

        // Send a json rsponse with failed flag
        res.status(500).json(
            {
                success: false,
                data: "Internal Server Failure",
                message: err.message
            }
        );
    }
}