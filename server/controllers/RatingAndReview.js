const RatingAndReview = require("../models/RatingAndReview");
const Course  = require("../models/Course");
const { default: mongoose } = require("mongoose");

// createRating
exports.createRating = async(req, res) => {
    try {
        // get user ID from the req.user
        const userId = req.user.id;

        // Fetch data from the req.body
        const {rating, review, courseId} = req.body;

        // check if user already Enrolled or not
        const courseDetails = await  Course.findOne(
            {
                _id: courseId,
                studentsEnrolled: {$elemMatch: {$eq: userId}}
            }
        );

        // calidate courseDetails
        if(!courseDetails) {
            res.status(404).json(
                {
                    success: false,
                    message: "User Not Enrolled in the Course"
                }
            );
        }

        // Check if user has already reviewed the course or not
        const alreadyReviewed = await RatingAndReview.findOne(
            {
                user: userId,
                course: courseId,
            }
        );

        if(alreadyReviewed) {
            return res.status(403).json(
                {
                    success: false,
                    message: "User has Already reviewed the ccourse"
                }
            );
        }

        // create ratingAndReview
        const ratingAndReview = await RatingAndReview.create(
            {
                user: userId,
                rating, 
                review,
                course: courseId
            }
        );

        // update the course with the rating and review
        const updatedCourse = await Course.findByIdAndUpdate({_id: courseId}, 
            {
                $push: {
                    ratingAndReviews: ratingAndReview._id,
                }
            },
            {
                new: true
        });

        console.log("Updated course Details after addign the review: ", updatedCourse);
        
        // return response
        res.status(200).json(
            {
                success: true,
                message: "Rating and Review Created and added to course successfully",
                data: ratingAndReview
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success:false,
                message: "Internal Server Error"
            }
        );
    }
}


// getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        // Get CourseId
        const courseId = req.body.courseId;

        // calculate average rating
        // Another way is to fetch the rating and review array from the course and calculate the avg and return the ratings
        const result = await RatingAndReview.aggregate(
            [
                {
                    $match: {
                        course: new mongoose.Types.ObjectId(courseId), 
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageRating: {$avg: "$rating"},
                    }
                }
            ]
        );

        // return rating
        if(result.length > 0) {
            return res.status(200).json(
                {
                    success:true,
                    averageRating: result[0].averageRating
                }
            );
        }

        // if rating/review dows not exist
        res.status(200).json(
            {
                success: true,
                message: "Average rating is 0, no ratings given yet",
                averageRating: 0
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success:false,
                message: "Internal Server Error"
            }
        );
    }
}


// getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({}).sort({rating: "desc"}).populate({
            path: user, 
            select: "firstName lastName email image"
        }).populate({
            path: course,
            select: "courseName"
        }).exec();

        // rerturn res
        res.status(200).json(
            {
                success: true,
                message: "All ratings and reviews fetched",
                data: allReviews,
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success:false,
                message: "Internal Server Error"
            }
        );
    }
}