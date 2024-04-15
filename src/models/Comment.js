const { Schema, model, Types } = require("mongoose");
// 1:N then 1 is the parent. Child must have id of parent
// e.g. user:comment is 1:N, comment:blog is 1:N
// comment has both blog id and user id

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  blog: {
    type: Types.ObjectId,
    required: true,
    ref: "blog",
  },
  user: {
    type: Types.ObjectId,
    required: true,
    ref: "user", //collection name (first created by model()). ref is equivalent to foreign key
  },
});

const Comment = model("comment", CommentSchema);

module.exports = { Comment }; // when retriving also use {} to retrive
