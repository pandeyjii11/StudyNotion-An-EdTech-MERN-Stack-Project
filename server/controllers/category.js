const Category = require("../models/Category");
const Course = require("../models/Course");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}


// category create handler function
exports.createCategory = async(req, res) => {
    try {
        // fetch data from the req.body
        const {name, description} = req.body;

        // Validate data
        if(!name || !description) {
            return res.status(400).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            );
        }

        // Create an entry into the DB
        const categoryDetails = await Category.create({
            name: name, description: description
        });

        console.log("categoryDetails: ", categoryDetails);

        // send a json response
        res.status(200).json(
            {
                success: true,
                message: "Tag Created Successfully",
                categoryDetails
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
                message: "Internal Server Error"
            }
        );
    }
}

// Get all category
exports.sowAllCategories = async(req, res) => {
    try {
        // Find all tags from DB which has name and description
        const allCategories = await Category.find({});

        // Send json response
        res.status(200).json(
            {
                success: true,
                message: "All tags fetched from the DB",
                data: allCategories
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Errpr Occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        );
    }
}

// categoryPageDetails
exports.categoryPageDetails = async(req, res) => {
    try {
        // Fetch Category Id
        console.log("req.body: ", req.body);
        const {categoryId} = req.body;
        console.log("CategoryId: ", categoryId);

        // Get course for Specified category
        const selectedCategory = await Category.findById(categoryId).populate({
            path: "course",
            match: {status: "Published"},
            populate: "ratingAndReviews"
        }).exec();

        // Vlidation
        if(!selectedCategory) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Data Not Found"
                }
            );
        }

        console.log(selectedCategory);

        if(selectedCategory.course.length === 0) {
            return res.status(404).json(
                {
                    success: false,
                    message: "No Courses found for the selected Category",
                }
            );
        }

        // get Course for different Categories 
        const categoriesExceptSelected = await Category.find({
            _id: {$ne: categoryId} // get all the category whose _id is not equal to the categpryId
        });
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
              ._id
          )
            .populate({
              path: "course",
              match: { status: "Published" },
            })
            .exec()

        // get Top Selling Course on the basis of some metrics as to what defines a course top selling course HomeWork
        // Find top 10 selling Courses
        const allCategories = await Category.find()
            .populate({
            path: "course",
            match: { status: "Published" },
            populate: {
                path: "instructor",
            },
            })
            .exec();
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        // Return response
        res.status(200).json(
            {
                success:true,
                message: "Fetched all the course with the specified category",
                data: {
                    selectedCategory: selectedCategory,
                    differentCategory: differentCategory,
                    mostSellingCourses: mostSellingCourses
                },
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Errpr Occured: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        );
    }
}