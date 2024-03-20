const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;
const { userRouter } = require("./routes/userRouter");
const app = express();

app.use(express.json());

const server = async function () {
  try {
    await mongoose.connect(url);
    console.log("db connected");
    app.use("/user", userRouter);
    app.listen(3000);
  } catch (error) {
    console.error(error.message);
  }
};

server();
