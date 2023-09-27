
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const {uploadToCloudinary} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


// createCourse
exports.createCourse = async(req, res) => {
    try {
        // Fetch Data from req body
        let {courseName, courseDescription, whatYouWillLearn, price, category,  tag: _tag, instructions:_instructions, status} = req.body;

        // get Thumnbail
        const thumbnail = req.files.thumbnailImage;

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.stringify(_tag);
        const instructions = JSON.stringify(_instructions);

        console.log("tag: ", tag);
        console.log("instructions: ", instructions);

        // validation
        if(!courseName || !courseDescription || ! whatYouWillLearn || !price || !tag.length || !thumbnail || !category) {
            // console.log(courseName);
            // console.log(courseDescription);
            // console.log(whatYouWillLearn);
            // console.log(price);
            // console.log(tag);
            // console.log(thumbnail);
            // console.log(category);
            return res.status(400).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            );
        }

        if(!status || status === undefined) {
            status = "Draft"
        }

        // Check For instructor
        // Since a instructor is a user and while creating course he must be signed in so he must have been auntheticated so in 
        // the req an object named as user must be present which conatins the payload from the jwt token
        // fetching instructor details from the req.user.id
        const userId = req.user.id;
        const instructorDetails = await User.findById({_id: userId}, {accountType: "Instructor"}); // finds the user with the user id and checks if accountType is instructor or not and give the data of the user
        console.log("instructor Details: ", instructorDetails);

        // Validate instructor if exist or not
        if(!instructorDetails) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Instructor not Found"
                }
            );
        }

        // Check if given category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Category details not Found"
                }
            );
        }

        // upload Image to cloudinary
        const thumbnailImage = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME);

        console.log("Thumbnail image: ", thumbnailImage);

        // create an Entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id, //instructorDetails is the data of the instructor fetched from the database
            price, 
            tag,
            category:categoryDetails._id, // categoryDetails is the data of the category fetched from the database,
            whatYouWillLearn, 
            thumbnail: thumbnailImage.secure_url,
            status, 
            instructions
        });

        // update the user(in this case the user is instructor) course List
        const instructor = await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id
            },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {
                new: true
            }
        ); 

        //console.log("instuctor: ",instructor);

        // update the category Shema
        const categoryDetails2 = await Category.findByIdAndUpdate(
            {
                _id: category,
            },
            {
                $push: {
                    course: newCourse._id,
                }
            },
            {
                new: true
            }
        );

        console.log("Category Details 2: ", categoryDetails2);

        // Send a json response
        res.status(200).json(
            {
                success: true,
                message: "Course created successfully",
                data: newCourse
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("error occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success: false, 
                message: "Internal Server Error"
            }
        );
    }
}

// getAllCourse
exports.getAllCourses = async(req, res) => {
    try {
        // Find all the course which are published and has all these values set true
        const allCourse = await Course.find(
            {status: "Published"},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true
            }
        ).populate("instructor").exec();

        // Send a json response
        res.status(200).json(
            {
                success: true,
                message: "All Course fetched successfully",
                data: allCourse
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("error occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success: false, 
                message: "Internal Server Error"
            }
        );
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
        return res.status(404).json({ error: "Course not found" })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
            if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
            } else {
            course[key] = updates[key]
            }
        }
        }

        await course.save()

        const updatedCourse = await Course.findOne({
        _id: courseId,
        })
        .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec()

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// getCourseDetails
exports.getCourseDetails = async(req, res) => {
    try {
        // get CourseId
        const {courseId} = req.body;

        // get course Details
        const courseDetails = await Course.find(
            {_id: courseId}
        ).populate(
            {
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                }
            }
        ).populate("category").populate("ratingAndReviews").populate(
            {
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            }
        ).exec();

        // validation
        if(!courseDetails) {
            return res.status(400).json(
                {
                    success:false,
                    message: `could find course with ${courseId}`
                }
            );
        }

        // Calculate the timeduration of the course from seconds to duration
        let totalDurationInSeconds = 0;

        courseDetails[0].courseContent.forEach( (content) => {
            content.subSection.forEach( (subSection) => {
                const timDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds+=timDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        // send reponse
        return res.status(200).json(
            {
                success: true,
                message: "Course Details Fetched Successfully",
                data: {
                    courseDetails: courseDetails,
                    timeDuration: totalDuration
                }
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("error occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success: false, 
                message: "Internal Server Error"
            }
        );
    }
}

// getFullCourseDetails
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        console.log("request: ", req);
        console.log("req body", req.body);
        // console.log("courseId here: ", courseId);
        // console.log("req.user: ", req.user);
        const userId = req.user.id
        // console.log("User id fetched while edit course controller function: ", userId);
        const courseDetails = await Course.findById(courseId)
        .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

        // let courseProgressCount = await CourseProgress.findOne({
        // courseID: courseId,
        // userId: userId,
        // });

        // console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
        return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
        })
        }

        // let totalDurationInSeconds = 0
        // courseDetails.courseContent.forEach((content) => {
        // content.subSection.forEach((subSection) => {
        //     const timeDurationInSeconds = parseInt(subSection.timeDuration)
        //     totalDurationInSeconds += timeDurationInSeconds
        // })
        // })

        // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                // totalDuration,
                // completedVideos: courseProgressCount?.completedVideos
                // ? courseProgressCount?.completedVideos
                // : [],
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
  
// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
        instructor: instructorId,
        }).sort({ createdAt: -1 })

        // Return the instructor's courses
        res.status(200).json({
        success: true,
        data: instructorCourses,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
        })
    }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
        return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
            $pull: { courses: courseId },
        })
        }

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
            const subSections = section.subSection
            for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
            }
        }

        // Delete the section
        await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
        })
    }
}