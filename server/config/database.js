const mongoose = require("mongoose");
require("dotenv").config()

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then( () => console.log("DB Connection Successful")).catch( (err) => {
        console.log("DB Connection Failed");
        console.error(err);
        console.log(err.message);
        process.exit(1);
    });
}

module.exports = dbConnect;