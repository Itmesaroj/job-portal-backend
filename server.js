const express = require("express");
const server = express();
const { config } = require("dotenv");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const connection = require("./connection/connection");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const jobRouter=require("./router/jobRouter")
const register = require("./router/userRouter");
const errorHandler=require("./middleware/errorMiddlware")
const applicationRouter=require("./router/application.router");
const  newsLetterCron  = require("./automation/newsLetter");
// configuration dotenv
config({ path: './config/config.env' });

// cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middleware section
server.use(cookieParser());
server.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

server.use(express.json());
server.use(cors({
  origin: function (origin, callback) {
    // Allow all origins (even undefined for tools like Postman)
    callback(null, origin || '*');
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
server.use(express.urlencoded({ extended: true }));
server.use(errorHandler)
// router set
server.use("/user", register);
server.use("/job",jobRouter)
server.use("/application",applicationRouter)
newsLetterCron()
// server listening and database connected with error handling
server.listen(process.env.PORT, async () => {
    try {
        await connection();
        console.log(`Server listening on port ${process.env.PORT} and the database is successfully connected`);
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
    }
});
