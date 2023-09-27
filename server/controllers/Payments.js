const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");


// Initiate the razorpay order
exports.capturePayment = async(req, res) => {
    const {courses} = req.body;
    const userId = req.user.id;

    // if No courses
    if(courses.length === 0) {
        return res.status(400).json(
            {
                success: false,
                message: "Please provide CoursesId "
            }
        );
    }

    let totalAmount = 0;
    for(const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(404).json(
                    {
                        success: false,
                        message: "Couese not found"
                    }
                );
            }
            const uid = new mongoose.Types.ObjectId(userId);

            if(course.studentsEnrolled.includes(uid)) {
                return res.status(400).json(
                    {
                        success: false,
                        message: "Student already Enrolled in the course"
                    }
                );
            }
            totalAmount+=course.price;
        }
        catch(err) {
            console.error(err);
            console.log(err.message);
            return res.status(500).json(
                {
                    success: false,
                    message: "Internal Server Error"
                }
            );
        }
    }

    const currency ="INR"
    const options = {
        amount: totalAmount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    // Creating Order
    try {
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment Response: ", paymentResponse);
        res.status(200).json(
            {
                success: true,
                message: paymentResponse,
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log(err.message);

        // Send a json response
        res.status(500).json(
            {
                success: true,
                message: "Internal Server Error"
            }
        );
    }
}

// Verify payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    console.log("IN VERIFY PAYMENT CONTROLLER")




    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {

        console.log(razorpay_order_id);
        console.log(razorpay_payment_id);
        console.log(razorpay_signature);
        console.log(courses);
        console.log(userId);
        return res.status(400).json(
            {
                success: false,
                message: "All fields Required"
            }
        );
    }

    let body = razorpay_order_id + "|" +  razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

    console.log("expected Singature: ", expectedSignature);

    if(expectedSignature === razorpay_signature) {
        //  Enroll Student
        await enrollStudents(courses, userId, res);

        // Return Response
        return res.status(200).json(
            {
                success: true,
                message: "Payment Verified "
            }
        );  
    }

    return res.status(400).json(
        {
            success: false,
            message: "Payment Failed"
        }
    );
}

const enrollStudents = async(courses, userId, res) => {
    if(!courses || !userId) {
        return res.status(400).json(
            {
                success: false,
                message: "Please Provide Data"
            }
        );
    }

    for(const courseId of courses) {

        try {
            // Update the course Schema by adding the student into the studentsEnrolled
            const enrolledCourse = await Course.findOneAndUpdate(
                {
                    _id: courseId
                },
                {
                    $push: {
                        studentsEnrolled: userId
                    }
                },
                {
                    new: true
                }
            );

            if(!enrolledCourse) {
                return res.status(404).json(
                    {
                        success: false,
                        message: "Course Not Found"
                    }
                );
            }

            console.log("ENROLED COURSE AFTER PAYMENT VERIFICATION: ", enrolledCourse);
            
            // Update the Usre Schema Course that is add course to the user course list
            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {
                    $push: {
                        courses: courseId
                    }
                },
                {
                    new: true,
                }
            );
            
            if(!enrolledStudent) {
                res.status(404).json(
                    {
                        success: false,
                        message: "User Not Found"
                    }
                );
            }

            console.log("ENROLLED STUDENTS AFTER PAYMENT VERIFICATION: ", enrolledStudent);

            // Send mail to the Student for buying course
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            );

            console.log("Email sent Successfully after payment verification: ", emailResponse);
        }
        catch(err) {
            console.error(err);
            console.log(err.message);

            // Send a json response
            return res.status(500).json(
                {
                    success: false,
                    message: "Internal Server Error"
                }
            );
        }
    }
}

exports.sendPaymetSuccessEmail = async(req, res) => {
    const{orderId, paymentId, amount} = req.body;
    const userId = req.user.id;

    if(!orderId | !paymentId || !amount || !userId) {
        return res.status(400).json(
            {
                success: false,
                message: "Please Provide all the fields"
            }
        );
    }

    try {
        // Fetch Student
        const enrolledStudent = await User.findById(userId);
        const mailResponse = await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            `Name: ${enrolledStudent.firstName}
            Amount: ${amount/100}
            Order Id: ${orderId}
            Payment Id: ${paymentId}`
        );

        if(!mailResponse) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Could not send payment successful email"
                }
            );
        }

        res.status(200).json(
            {
                success: true,
                message: "Payment Successful email Sent"
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error in sending mail of successful payment: ", err.message);

        // Send a json reponse
        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        );
    }
}





// // capture the payment and innitiate the razorpay order
// exports.capturePayment = async(req, res) => {
//     try {
//         // Fetch Course  id from req.body
//         const {courseId} = req.body;

//         // Fetch userId from req.user
//         const userId = req.user.id;

//         // validate caourseId
//         if(!courseId) {
//             return res.status(400).json(
//                 {
//                     success:false,
//                     message:"Please provide valid course Id"
//                 }
//             );
//         }

//         // Get Course Details
//         let courseDetails = await Course.findById({_id: courseId});
        
//         // Validate courseDetails
//         if(!courseDetails) {
//             return res.status(404).json(
//                 {
//                     success:false, 
//                     message: "Course Not Found"
//                 }
//             );
//         }

//         // check if useer already has bought the course
//         // Convert the userId from String to objectId as in DB it is stored as ObjectId
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(courseDetails.studentsEnrolled.includes(uid))
//         {
//             return res.status(400).json(
//                 {
//                     success: false,
//                     message: "Student is already enrolled"
//                 }
//             );
//         }

//         // create Order
//         const amount = courseDetails.price;
//         const currency = "INR";

//         const options = {
//             amount: amount*100,// 100 is multiplied because it is mentiones in the Razorpay documnetation because Rs500 will bs written as 500.00
//             currency: currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes: {
//                 courseId: courseId,
//                 userId: userId
//             }
//         }

//         try {
//             // initiate the payment from razrpay
//             const paymentResponse = await instance.orders.create(options);
//             console.log("Payment Response: ", paymentResponse);

//             // return response
//             return res.status(200).json(
//                 {
//                     success: true,
//                     message: "Order Initiation Successful",
//                     courseName: courseDetails.courseName,
//                     courseDescription: courseDetails.courseDescription,
//                     thumbnail: courseDetails.thumbnail,
//                     orderId: paymentResponse.id,
//                     currency: paymentResponse.currency,
//                     amount: paymentResponse.amount
//                 }
//             );
//         }
//         catch(error) {
//             console.log("Error in payment: ", error);
//             res.json(
//                 {
//                     success:false,
//                     message: "could not initiate order"
//                 }
//             );
//         }

//     }
//     catch(err) {
//         console.error(err);
//         console.log("Error Occured: ", err.message);

//         // Send a json response
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Internal Server Error"
//             }
//         );
//     }
// }


// // verify Signature
// exports.verifySignature = async(req, res) => {
//     try {
//         // Fetch webhook secret from the server
//         const webhookSecret = "12345678"

//         // fetch the signature from the razorpay header
//         const signature = req.headers["x-razorpay-signature"];

//         // Signature received from the razorpay is encrypted which cannot be decrypted so we will hash our webhookSecret through the exact same 
//         // hashing tachnique and the verify the signature by matching
//         // Hashing the webhookSectret
//         const shasum = crypto.createHmac("sha256", webhookSecret); //hash the webhookSecret using the sha-256 algoithm
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest("hex");

//         // Match signature and digest
//         if(signature === digest) {
//             console.log("Payment is Authorised");

//             // Enroll user into the course update the userSchema and courseSchema
//             // Get the userId and courseId from the req.body.payload.payment.entity.notes where we inserted at the time of order creation
//             const {courseId, userId} = req.body.payload.payment.entity.notes;

//             // find the course and enroll students into it
//             const updatedCourse = await Course.findByIdAndUpdate(
//                 {
//                     _id: courseId
//                 },
//                 {
//                     $push: {
//                         studentsEnrolled: userId,
//                     }
//                 },
//                 {
//                     new: true
//                 }
//             );

//             // Validate the updatedCourse response
//             if(!updatedCourse) {
//                 return res.status(400).json(
//                     {
//                         success: false,
//                         message: "Course Not Found"
//                     }
//                 );
//             }

//             console.log("UpdatedCourse after enrolliing student: ", updatedCourse);

//             // add course to the student courseList
//             const updatedUser = await User.findByIdAndUpdate(
//                 {
//                     _id: userId,
//                 },
//                 {
//                     $push: {
//                         courses: courseId
//                     }
//                 },
//                 {
//                     new: true,
//                 }
//             );

//             // Validate updateduser
//             if(!updatedUser) {
//                 return res.status(400).json(
//                     {
//                         success: false,
//                         message: "User Not Found",
//                     }
//                 );
//             }

//             console.log("updated User after enrolling the student to the course by adding the course to the student courseList", updatedUser);

//             // send mail for Successful buying of the course
//             const emailResponse = await mailSender(
//                 updatedUser.email, 
//                 "Congratulations from StudyNotion",
//                 "Congratulation! you have succeffuly enrolled into the new course"
//             );
//             console.log("Email reponse: ", emailResponse);

//             // return response
//             res.status(200).json(
//                 {
//                     success: true,
//                     message: "Signature Aerified and Aourse Added"
//                 }
//             );
//         }
//         else {
//             res.status(400).json(
//                 {
//                     success: false,
//                     message: "Signature Verification Falied"
//                 }
//             );
//         }
//     }
//     catch(err) {
//         console.error(err);
//         console.log("Error Occured: ", err.message);

//         // Send a json response
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Internal Server Error"
//             }
//         );
//     }
// }