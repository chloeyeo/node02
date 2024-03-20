// import { User } from "./models/User"; // difference between import and require??

const { User } = require("./models/User"); // exported {User} so must import {User} with {} NOT WITHOUT!

// import - export default
// require - module.exports

const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_URL;

//MONGODB_URL=mongodb+srv://chloeyeo:qjGj2Cf352Cpa8Dn@mongodb.shojwhr.mongodb.net/book?retryWrites=true&w=majority&appName=MongoDB
// the book after the net/ creates a new DATABASE (not collection) 'book' in the db that has all the schemas
// collection=schema(=table)(=model) (just when you create schema it automatically creates a schema) is a table inside a database
// in mysql you need to create collection and schema separately
// mongoose.model("user", UserSchema) creates a user collection for the schema

/*collection vs schema vs model
A model defines a programming interface for interacting
with the database (read, insert, update, etc).
So a schema answers "what will the data in this
collection look like?" and a model provides functionality
like "Are there any records matching this query?"
or "Add a new document to the collection".

A model is a compiled version of the schema.
One instance of the model will map to one document in the database.
It is the model that handles the reading, creating, updating,
and deleting of documents.
A document in a Mongoose collection is a single instance of a model. 


 */

// need json formatter chrome extension to view json on screen

/*It creates an object app that contains the express framework API,
and in the final line returns a reference to that object (return app;). */
const app = express();

/*app.use() is intended for binding middleware to your application */
app.use(express.json());

// const users = [];

const server = async function () {
  try {
    // connect to db first inside server before server connection
    await mongoose.connect(url);
    console.log("db connected");

    // now create schema in models folder once db is connected

    // app.get().listen(3000);
    /*  listen() in Express is like telling your app to start
        listening for visitors on a specific address and port*/
    app.listen(3000);

    app.get("/user", async function (req, res) {
      try {
        const users = await User.find(); // putting or not putting {} in find() are both fine
        return res.send({ user: users }); // send json {} object (middleware will convert object to json)
      } catch (error) {
        // 500 for server-side error
        return res.status(500).send({ error: error.message });
      }
    });

    app.get("/user/:userId", async function (req, res) {
      try {
        const { userId } = req.params; // same as getting req.params.userId
        const user = await User.findOne({ _id: userId });
        return res.send({ user: user });
      } catch (error) {
        // 500 for server-side error
        return res.status(500).send({ error: error.message });
      }
    });

    app.post("/user", async function (req, res) {
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

    app.delete("/user/:userId", async function (req, res) {
      try {
        const { userId } = req.params; // same as getting req.params.userId
        const user = await User.findByIdAndDelete({ _id: userId });
        return res.send({ user: user });
      } catch (error) {
        // 500 for server-side error
        return res.status(500).send({ error: error.message });
      }
    });

    app.put("/user/:userId", async function (req, res) {
      try {
        const { userId } = req.params; // same as getting req.params.userId
        const { username, name, first, last, age, email } = req.body;
        const user = await User.findByIdAndUpdate(
          { _id: userId },
          //   { $set: req.body },
          { $set: { username, age, name.first: first, email } },
          { new: true }
        );
        return res.send({ user: user });
      } catch (error) {
        // 500 for server-side error
        return res.status(500).send({ error: error.message });
      }
    });

    //{ new: true }

    // {
    //     "username":"han",
    //     "name": {
    //       "first": "han",
    //       "last": "hey",
    //     }
    //   }
  } catch (error) {
    console.error(error.message);
  }
};

server();
