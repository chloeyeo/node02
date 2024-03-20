const { default: mongoose } = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    name: {
      first: {
        type: String,
        require: true,
      },
      last: {
        type: String,
        require: true,
      },
    },
    age: Number,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema); // creates a user COLLECTION(=SCHEMA=MODEL)(=TABLE in mysql). user is the name of collection
module.exports = { User };
