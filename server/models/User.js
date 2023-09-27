const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        accountType: {
            type: String,
            enum: ["Student", "Instructor", "Admin"],
            required: true
        },

        additionalDetails: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
        },

        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            }
        ],

        image: {
            type: String,
            required: true
        },

        // This token is used for password reset link generation
        token: {
            type:String,
        },

        resetPasseordExpires: {
            type:Date,
        },

        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CourseProgress"
            }
        ]
    }
);

module.exports = mongoose.model("User", userSchema);