const mailSender = require("../utils/mailSender");

exports.Contact = async(req, res) => {
    try {
        const {firstname, lastname, email, message, phoneNo, countryCode} = req.body;

        const mailResponse = await mailSender(
            email, 
            "Your Data Sent Successfully", 
            `Thank you for reaching out to us we will get back to you soon 
            First Name: ${firstname}
            Last Name: ${lastname}
            Email: ${email}
            Phone Number: ${countryCode} - ${phoneNo}
            Message: ${message}
            `);

        console.log("Contact us email response: ", mailResponse);

        res.status(200).json(
            {
                success: true,
                message: "Email Sent Successfully"
            }
        );
    }
    catch(err) {
        console.error(err);
        console.log("Error Occured in Contact Us Controller: ", err.message);

        // Send a json response
        res.status(500).json(
            {
                success: false,
                data: "Internal Server Error",
                message: err.message
            }
        );
    }
}