
const User =require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


// resetPasswordToken
exports.resetpasswordToken = async (req, res) => {
    try {
        // Fetch Data from the req.body
        const {email} = req.body

        // check if user exist
        const user = await User.findOne({email});

        // if user not exist
        if(!user)
        {
            return res.status(400).json(
                {
                    success: false,
                    message: "User not Found"
                }
            );
        }

        // Generate token
        const token = crypto.randomUUID();

        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate( 
            {
                email: email
            }, 
            {
                token: token,
                resetPasswordExpires: 5*60*10000
            },
            {
                new: true
        });


        // create url
        const url = `http://localhost:3000/update-password/${token}`;

        // Send mail with the link

        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);

        // Send success response
        res.status(200).json(
            {
                success: true,
                message: "Email Sent Successfully for password reset"
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success: false,
                message: "internal Server Error"
            }
        );
    }
}


// resetPasword
exports.resetpassword = async(req, res) => {
    try {
        // Fetch data from req.body
        const {token, password, confirmpassword} = req.body;

        console.log(token);
        console.log(password);
        console.log(confirmpassword);

        // Validate data
        if(!token || !password || !confirmpassword)
        {
            return res.status(401).json(
                {
                    success:false,
                    message: "All fields required"
                }
            );
        }

        // Check is if password match or not
        if(password !== confirmpassword) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Password do not match"
                }
            );
        }

        // Get user details from the DB using the token
        var userDetails = await User.findOne({token: token});

        // If no Entry Found return response
        if(!userDetails) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Token is invalid"
                }
            );
        }

        // check if token is expired or not
        if(userDetails.resetPasseordExpires < Date.now()) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Token Expired"
                }
            );
        }

        // hash(encrypt) password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password
        await User.findOneAndUpdate(
            {
                token: token
            },
            {
                password: hashedPassword
            },
            {
                new: true
            }
        );

        // Return success response
        res.status(200).json(
            {
                success: true,
                message: "Password Reset Successful"
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success: false,
                message: "internal Server Error"
            }
        );
    }
}