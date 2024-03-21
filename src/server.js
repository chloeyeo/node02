const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;
const { userRouter } = require("./routes/userRouter");
const { blogRouter } = require("./routes/blogRouter");
const { cors } = require("cors");
const app = express();

app.use(express.json());
app.use(cors()); // Access-Control-Allow-Origin: *

/*
// enabling CORS for some specific origins only. 
let corsOptions = { 
   origin : ['http://localhost:5500'], 
} 
app.use(cors(corsOptions)) 
*/

const server = async function () {
  try {
    await mongoose.connect(url);
    mongoose.set("debug", true);
    console.log("db connected");
    // Bind application-level middleware to an instance
    // of the app object by using the app.use()
    // Mount the router named userRouter as middleware at path /user
    // If you open /user in your browser, userRouter will get called,
    app.use("/user", userRouter);
    app.use("/blog", blogRouter);
    app.listen(3003);
  } catch (error) {
    console.error(error.message);
  }
};

server();
