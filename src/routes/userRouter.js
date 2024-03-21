// Router-level middleware works in the same way as application-level middleware,
// except it is bound to an instance of express.Router()
const { Router } = require("express");
const userRouter = Router();
// this is same as:
// const express = require("express");
// const userRouter = express.Router();

const { User } = require("../models/User");

userRouter.get("/", async function (req, res) {
  try {
    const users = await User.find({});
    return res.send({ users: users });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.get("/:userId", async function (req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    return res.send({ user: user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.post("/", async function (req, res) {
  try {
    const user = new User(req.body);
    await user.save();
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.delete("/:userId", async function (req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete({ _id: userId });
    return res.send({ user: user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

userRouter.put("/:userId", async function (req, res) {
  try {
    const { userId } = req.params;
    const {
      name: { first, last },
      username,
      age,
      email,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { age, email, name: { first, last }, username },
      { new: true }
    );
    return res.send({ user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = { userRouter };
