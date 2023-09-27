const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async(email, title, body) => {
    try {
        let transporter = new nodemailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            }
        );

        // Sending Mail
        let info = await transporter.sendMail(
            {
                from: "StudyNotion",
                to: `${email}`,
                subject: `${title}`,
                html: `${body}`
            }
        );

        console.log(info);
        return info;
    }
    catch(err) {
        console.error(err);
        console.log(err.message);
    }
}

module.exports = mailSender;