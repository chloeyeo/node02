const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

// REM memory = on browser close data stored erases
// REM memory is more expensive than storing data in hard disk
// if we store e.g. all 1000 data in REM memory, it will slow down
// if e.g. few thousand users all access the 1000 data in REM memory
// then REM will become very slow, even if on browser close
// rem memory erases, since there are so many users accessing at the same time.
// so e.g. store only 10 data in REM

commentRouter.get("/", async function (req, res) {
  try {
    const { blogId } = req.params;
    // otherwise Comment.find({}) will find ALL comments even from other blog posts
    // we want to find comments just from the specified blog post
    const comments = await Comment.find({ blog: blogId }); // WHERE blog. same as {blog: { _id: blogId }}
    return res.send({ comments });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

commentRouter.get("/:commentId", async function (req, res) {
  try {
    //const { blogId } = req.params;
    const { commentId } = req.params;
    //const comment = await Comment.findById({ _id: commentId, blog: blogId });
    const comment = await Comment.findById({ commentId });
    return res.send({ comment });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

commentRouter.post("/", async function (req, res) {
  try {
    const { blogId } = req.params;
    const { userId, content } = req.body;
    // async so faster then sync
    const [blog, user] = await Promise.all([
      Blog.findById(blogId),
      User.findById(userId),
    ]);
    // like sync using await
    // const blog = await Blog.findById(blogId);
    // const user = await User.findById(userId);
    if (!blog) {
      return res.status(400).send({ error: "blog post does not exist" });
    }
    if (!user) {
      return res.status(400).send({ error: "user does not exist" });
    }
    if (!content) {
      return res.status(400).send({ error: "blog post has no content" });
    }
    const comment = new Comment({ ...req.body, blog, user });
    await comment.save();
    return res.send({ comment });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

commentRouter.delete("/:commentId", async function (req, res) {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete({ commentId });
    return res.send({ comment });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

commentRouter.put("/:commentId", async function (req, res) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).send({ error: "blog post has no content" });
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content } },
      { new: true }
    );
    return res.send({ comment });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = { commentRouter };
