// Instantiating Server
const express = require("express");
const app = express();


require("dotenv").config();
const dbConnect = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/course");
const contactRoutes = require("./routes/contact");
const paymentRoutes = require("./routes/payments");

// Get PORT
const PORT = process.env.PORT_NAME || 4000;


// Using Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
    cors(
        {
            origin: "https://65143ee551d2c92f4ee577b6--thunderous-stardust-96d3a5.netlify.app",
            credentials: true
        }
    )
);

app.use(fileUpload(
    {
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
));


// Mount all the api routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/reach", contactRoutes);
app.use("/api/v1/payment", paymentRoutes);


// Connetion 
// Connect Cloudinary
cloudinaryConnect();
// Database Connect
dbConnect();

// Listen to Server
app.listen(PORT, () => {
    console.log(`Server is up and running at port ${PORT}`);
});

// Default Route
app.get("/", (req, res) => {
    return res.json(
        {
            success: true,
            message: `Server is up and running at port ${PORT}`
        }
    );
});

