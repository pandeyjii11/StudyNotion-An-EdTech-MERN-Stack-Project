const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type:String,
            required: true
        },
        otp: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 5*60*1000
        },
    }
);


// A function -> send mail
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp);
        console.log("Email sent successfully", mailResponse);
    }
    catch(error) {
        console.log("error Occured while sending mail", error);
        throw error;
    }
}

otpSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

// // Pre Middleware for sending the otp to the user for verifying the user before saving(or, creating an entry into the DB of the) the user

module.exports = mongoose.model("OTP", otpSchema);