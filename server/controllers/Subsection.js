const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadToCloudinary} = require("../utils/imageUploader");
const { response } = require("express");

// createSubsection
exports.createSubSection = async(req ,res) => {
    try {
        // Fetch Data
        const {sectionId, title, description} = req.body;

        // Fetch video file
        const video= req.files.video;

        // Validation
        if(!sectionId || !title || !description || !video) {
            // console.log(sectionId);
            // console.log(title);
            // // console.log(timeDuration);
            // console.log(description);
            // console.log(video);
            return res.status(400).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            );
        }

        // Upload video to cloudinary
        const uploadDetails = await uploadToCloudinary(video, process.env.FOLDER_NAME);

        console.log(uploadDetails);

        // Create a subsection
        const subsectionDetails = await SubSection.create({
            title: title, 
            timeDuration:`${uploadDetails.duration}`, 
            description: description, 
            videoUrl: uploadDetails.secure_url
        });

        // update subsection id into the section
        const updatedSection = await Section.findByIdAndUpdate(
            {
                _id: sectionId,
            },
            {
                $push: {
                    subSection: subsectionDetails._id
                }
            },
            {
                new: true
            }
        ).populate("subSection").exec();

        // Send a repsonse
        res.status(200).json(
            {
                success: true,
                message: "Subsection created Successfully",
                data: updatedSection
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("error occured: ", err.message);

        // send a json response
        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        );
    }
}

// updateSubSection
exports.updateSubSection = async(req, res) => {
    try {
        // Fetch Data from the req.body
        const {sectionId, subSectionId, title, description, timeDuration} = req.body;

        // Fetch the SubSection to be updated
        // console.log(subSectionId);
        const subsection = await SubSection.findById(subSectionId);

        // validate subsection
        if(!subsection) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Subsection not Found"
                }
            );
        }

        // Validate Data and update
        if(title !== undefined) {
            subsection.title = title;
        }

        if(description !== undefined) {
            subsection.description = description;
        }

        // Upload the video to cloudinary
        if(req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadToCloudinary(video, process.env.FOLDER_NAME);
            subsection.videoUrl = uploadDetails.secure_url
            subsection.timeDuration = `${uploadDetails.duration}`
            console.log(uploadDetails);
        }

        // Update subSection
        await subsection.save();

        // populate the section with the subsection id 
        const updatedSection = await Section.findById({_id: sectionId}).populate("subSection").exec();

        // Send a json response
        res.status(200).json(
            {
                success:true,
                message: "SubSection updated Successfully",
                data: updatedSection
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("error occured: ", err.message);

        // send a json response
        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        );
    }
}


// deleteSubSection
exports.deleteSubSection = async(req, res) => {
    try {
        // Fetch Data
        const {sectionId, subSectionId} = req.body;

        // Update Section delete subsection instance from the section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                }
            },
            {
                new: true
            }
        ).populate("subSection").exec();

        // Delete the data from the subSection DB
        const subsection = await SubSection.findByIdAndDelete({ _id: subSectionId });

        // if not subsection found return response
        if(!subsection) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Subsection not Found"
                }
            );
        }

        // return response
        res.status(200).json(
            {
                success: true,
                message: "Subsection Deleted",
                data: updatedSection
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("error occured: ", err.message);

        // send a json response
        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        );
    }
}





