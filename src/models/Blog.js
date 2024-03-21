const { Schema, model, Types } = require("mongoose");

const BlogSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    islive: { type: Boolean, required: true, default: false },
    user: { type: Types.ObjectId, required: true, ref: "user" },
  },
  { timestamps: true }
);
const Blog = model("blog", BlogSchema); // create Blog collection in db
module.exports = { Blog };
