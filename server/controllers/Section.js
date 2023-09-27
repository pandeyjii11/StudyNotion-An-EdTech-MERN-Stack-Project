const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async(req, res) => {
    try {
        // Fetch data
        const {sectionName, courseId} = req.body;

        // validate data
        if(!sectionName || !courseId) {
            return res.status(400).json(
                {
                    success: false,
                    message: "All fields required"
                }
            );
        }

        // Create Section
        const newSection = await Section.create(
            {sectionName}
        );

        // update the course schema with the section Id
        const updatedCourse = await Course.findByIdAndUpdate({_id: courseId}, {$push: {courseContent: newSection._id}}, {new: true})
                                                            .populate("courseContent").exec();

        // return a json response
        res.status(200).json(
            {
                success: true,
                message: "Section Created Successfully",
                data: newSection,
                updatedCourseDetails: updatedCourse
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

// updateSection
exports.updateSection = async (req, res) => {
    try {
        // Fetch data
        const {sectionName, sectionId, courseId} = req.body;

        // data Validation
        if(!sectionName || !sectionId) {
            return res.status(400).json(
                {
                    success:false,
                    message: "All fields required"
                }
            );
        }

        // Update data in the DB
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId}, {sectionName:sectionName}, {new: true});

        // Fetch the course
        const course = await Course.findById(
            {
                _id: courseId
            }
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        })

        // send json response
        res.status(200).json(
            {
                success: true,
                message: "Section Updated Successfully",
                data: course
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

// deleteSection
exports.deleteSection = async(req, res) => {
    try {
        // fetch id -> assuming that we are sending the id in parameters(params)
        const {sectionId, courseId} = req.body;

        console.log("sectionId: ", sectionId);
        console.log("sectionId: ", courseId);
        
        // Delete data from the Section DB
        const deletSection = await Section.findByIdAndDelete({_id: sectionId});

        //delete sub section
		await SubSection.deleteMany({_id: {$in: deletSection.subSection}});

        console.log("deleted Section: ", deletSection);

        // Delete Data from the Course DB
        const updatedCourse = await Course.findByIdAndUpdate(
            {_id: courseId},
            {
                $pull: {
                    courseContent: sectionId
                }
            },
            {
                new: true
            }
        ).populate(
            {
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            }
        ).exec();

        // console.log("updatedCourse: ", updatedCourse);
        
        // return response
        res.status(200).json(
            {
                success: true,
                message: "Section deleted successfully",
                data: updatedCourse
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










