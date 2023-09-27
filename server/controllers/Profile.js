const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const {uploadToCloudinary} = require("../utils/imageUploader");


exports.updateProfile = async(req, res) => {
    try {
        // Fetch Data 
        const {gender, dateOfBirth="", about="", contactNumber} = req.body;

        // Fetch userId from the req.user which was created at the time of user authentication which contains payload 
        const userId = req.user.id;

        console.log("Gender: ", gender);
        console.log("Contact number: ", contactNumber);
        // Validation
        if(!gender || !contactNumber) {
            return res.status(400).json(
                {
                    success: false,
                    message: "All feilds are required"
                }
            );
        }

        // Find user using userId
        const user = await User.findById({_id: userId});

        // Vslidate user
        if(!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User Not Found"
                }
            );
        }

        // Find user profile from the user.additionalDetails
        const profile = await Profile.findById({_id: user.additionalDetails});

        // Update profile
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.gender = gender;
        profile.conatctNumber = contactNumber;

        // Find the updated user details
        const updatedUserDetails = await User.findById(userId)
        .populate("additionalDetails")
        .exec()

        // Update profile (save profile)
        await profile.save();

        // Return response
        res.status(200).json(
            {
                success:true,
                message: "Profile Updated Successfully",
                updatedUserDetails,
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a json Response
        res.status(500).json(
            {
                success: false, 
                message: "Internal Server Error"
            }
        );
    }
}

// deleteAccount
// Explore -> how can we schedule this deletion operation
exports.deleteAccount = async(req, res) => {
    try {
        // Fetch Data the userId
        const userId = req.user.id;

        console.log("User ID for deleting the Account: ", userId);

        // fetch user
        const userDetails = await User.findById({_id: userId});

        // Validate user
        if(!userDetails) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User NOt Found"
                }
            );
        }

        console.log("userDetails: ", userDetails);

        // Delete the user profile linked with it
        const profile = await Profile.findByIdAndDelete({_id: new mongoose.Types.ObjectId(userDetails.additionalDetails)});

        console.log("profile Details: ", profile);

        // Unenroll user from the all enrolled courses
        const userCourses = userDetails.courses;
        for(let i=0; i<userCourses.length; i++) {
            var courseId = userCourses[i];
            const course = await Course.findByIdAndUpdate(
                {
                    _id: courseId
                },
                {
                    $pull: {
                        studentsEnrolled: userId
                    }
                },
                {
                    new: true
                }
            );

            // console.log("course: ", course);
        }

        // console.log("Here");
        // Delete the user
        const deletedUser = await User.findByIdAndDelete({_id: userId});

        console.log("deletedUser: ", deletedUser);

        // return response
        return res.status(200).json(
            {
                success: true,
                message: "User Deleted Successfully"
            }
        );

    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a json Response
        res.status(500).json(
            {
                success: false, 
                message: "Internal Server Error"
            }
        );
    }
}

// getAllUserDetails 
exports.getAllUserDetails = async(req, res) => {
    try {
        // Fetch User Id
        const userId = req.user.id;

        // Fetch user
        const user = await User.findById({_id: userId}).populate("additionalDetails").exec();

        // Validation
        if(!user) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User Not Found"
                }
            );
        }
        
        // return response
        res.status(200).json(
            {
                success: true,
                message: "User Data Fetched",
                data: user
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a json Response
        res.status(500).json(
            {
                success: false, 
                message: "Internal Server Error"
            }
        );
    }
}

// getEnrolledCourses
exports.getEnrolledCourses = async (req, res) => {
  try{
    const userId = req.user.id;

    const userDetails = await User.findOne({_id: userId}).populate(
        {
            path:"courses",
            populate: {
                path: "courseContent",
                populate: {
                    path:"subSection",
                }
            }
        }
    ).exec();

    if(!userDetails)
    {
      return res.status(404).json(
        {
          success: false,
          message: "User Not Found"
        }
      );
    }

    console.log("IN PROFILW CORNTROLLER: ", userDetails);
    // Send Sucess json response
    res.status(200).json(
      {
        success: true,
        data: userDetails.courses,
      }
    );
  }
  catch(err) {
    console.error(err);
    console.log(err.message);

    // Send json response
    res.status(500).json(
      {
        success: false,
        message: "Internal Server Error"
      }
    );
  }
}
  
// //   instructorDashboard
//   exports.instructorDashboard = async (req, res) => {
//     try {
//       const courseDetails = await Course.find({ instructor: req.user.id })
  
//       const courseData = courseDetails.map((course) => {
//         const totalStudentsEnrolled = course.studentsEnroled.length
//         const totalAmountGenerated = totalStudentsEnrolled * course.price
  
//         // Create a new object with the additional fields
//         const courseDataWithStats = {
//           _id: course._id,
//           courseName: course.courseName,
//           courseDescription: course.courseDescription,
//           // Include other course properties as needed
//           totalStudentsEnrolled,
//           totalAmountGenerated,
//         }
  
//         return courseDataWithStats
//       })
  
//       res.status(200).json({ courses: courseData })
//     } catch (error) {
//       console.error(error)
//       res.status(500).json({ message: "Server Error" })
//     }
//   }

// Update Display Picture
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

// Instructor Dashboard
exports.instructorDashboard = async(req, res) => {
  try {
    const userId = req.user.id;
    const courseDetails = await Course.find({instructor: userId});

    // Validation
    if(!courseDetails) {
      return res.status(404).json(
        {
          success: false,
          message: "Instructor not found",
        }
      );
    }

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled*course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated
      }

      return courseDataWithStats
    })

    res.status(200).json(
      {
        success: true,
        courses: courseData
      }
    );
  }
  catch(err) {
    console.error(err);
    console.log(err.message);

    // Send a json Reponse
    res.status(500).json(
      {
        success: false,
        message: "Internal Server Error"
      }
    );
  }
}