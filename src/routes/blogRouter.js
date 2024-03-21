const { Router } = require("express");
const blogRouter = Router();
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");

blogRouter.get("/", async function (req, res) {
  try {
    const blogs = await Blog.find({});
    return res.send({ blogs });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

blogRouter.get("/:blogId", async function (req, res) {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    return res.send({ blog });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

blogRouter.post("/", async function (req, res) {
  try {
    /*example post request:
    {
    "title": "new blog post",
    "content": "content of post",
    "userId": "65fa624771832144e6837d39"
    } 
    islive has a default value false so even though required is true the value will never be empty
    if we don't put islive it will be automatically have value false so no error will occur. */
    const { userId } = req.body; // so when sending post request in postman, must write field "userId", NOT user - user field is created here in backend from the userId and put into Blog Schema
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ error: "user does not exist" });
    }
    // join operation: (user is the foreign key)
    const blog = new Blog({ ...req.body, user }); // this deep copy copies all of req body - title,content,islive,userId, AND , user
    /*A shallow copy creates a new array, but it does not create new copies of the elements within the array.
    Instead, it points to the same elements as the original array. A deep copy, on the other hand,
    creates a completely independent copy of both the array and its data. It does not share any data with the original array. */
    await blog.save();
    return res.send({ success: true, blog: blog });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

blogRouter.put("/:blogId", async function (req, res) {
  try {
    const { blogId } = req.params;
    const { title, content } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $set: { title, content } },
      { new: true }
    );
    return res.send({ success: true, blog });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

blogRouter.delete("/:blogId", async function (req, res) {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndDelete(blogId);
    return res.send({ success: true, blog });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

/*PATCH applies only partial modification to a resource,
unlike POST and PUT, which modify the entire resource.
PATCH is non-idempotent, while PUT is idempotent.
PATCH can save you some bandwidth, as updating a field
with PATCH means less data being transferred than
sending the whole record with PUT. */

/*router vs controller(in mvc):
"Routes" to forward the supported requests
(and any information encoded in request URLs)
to the appropriate controller functions.
Controller functions to get the requested data from the models,
create an HTML page displaying the data,
and return it to the user to view in the browser. */

blogRouter.patch("/:blogId/live", async function (req, res) {
  try {
    const { blogId } = req.params;
    const { islive } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { islive }, // $set is not required you can use but you don't have to
      { new: true }
    );
    return res.send({ success: true, blog });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

module.exports = { blogRouter };
