const { Router } = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const { User } = require("../models/User");

// make sure u do npm start before using talend api tester or postman

userRouter.get("/", async function (req, res) {
  try {
    const users = await User.find({}); // putting or not putting {} in find() are both fine
    return res.send({ user: users }); // send json {} object (middleware will convert object to json)
  } catch (error) {
    // 500 for server-side error
    return res.status(500).send({ error: error.message });
  }
});

userRouter.get("/:userId", async function (req, res) {
  try {
    const { userId } = req.params; // same as getting req.params.userId
    const user = await User.findOne({ _id: userId });
    return res.send({ user: user });
  } catch (error) {
    // 500 for server-side error
    return res.status(500).send({ error: error.message });
  }
});

userRouter.post("/", async function (req, res) {
  try {
    const user = new User(req.body);
    await user.save(); //creates new user // since it goes to db to save it TAKES TIME. DB is on another server so it TAKES time thus
    // it is a promise since we don't know when the going to and coming back from db action to save will finish, thus we use await to wait for promise to return before going further.
    return res.send({ user });
  } catch (error) {
    // 500 for server-side error
    return res.status(500).send({ error: error.message });
  }
});

userRouter.delete("/:userId", async function (req, res) {
  try {
    const { userId } = req.params; // same as getting req.params.userId
    const user = await User.findByIdAndDelete({ _id: userId });
    return res.send({ user: user });
  } catch (error) {
    // 500 for server-side error
    return res.status(500).send({ error: error.message });
  }
});

userRouter.put("/:userId", async function (req, res) {
  try {
    const { userId } = req.params; // same as getting req.params.userId
    const {
      age,
      email,
      name: { first, last },
    } = req.body; // need to do this first before setting
    const user = await User.findByIdAndUpdate(
      userId,
      //   { _id: userId },
      //   { $set: req.body },
      // if not included in $set, the put request itself gets accepted
      // but e.g. username does not actually gets changed if it wasn't in $set
      // if set both age and email, can only send either one or both in put
      // can only set age, can only set email, can set both, these will all work
      // when trying to set something else, put request will send 200 ok but
      // that other field won't actually be changed
      { $set: { age, email, name: { first, last } } }, // same as age: age, email: email
      //{ $set: { age: age, email: email } }, // same as above!
      // cannot do e.g. ageHi:age - then it will send 200 OK however it
      // won't recognise the ageHi field in schema thus age won't be changed
      { new: true }
    );
    return res.send({ user: user });
  } catch (error) {
    // 500 for server-side error
    return res.status(500).send({ error: error.message });
  }
});

// {
//     "name": {
//       "first": "newFirst",
//       "last": "newLast"
//     }
//   }

module.exports = { userRouter };
