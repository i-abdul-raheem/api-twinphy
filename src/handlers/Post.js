const Response = require("./Response");
const { User } = require("../models");
const mongoose = require("mongoose");
const { Post: PostModel, ReportPost } = require("../models");
const AWS = require("aws-sdk");

class Post extends Response {
  getAllPosts = async (req, res) => {
    try {
      const postId = req.params?.id;
      let result;
      if (!postId) {
        // Fetch all posts
        result = await PostModel.find({})
          .sort({ updatedAt: -1 })
          .populate("user_id");
      } else {
        // Fetch a single post by ID
        result = await PostModel.findOne({ _id: postId });
      }
      if (!result) {
        const message = postId ? "Post not found" : "No posts found";
        return res.status(404).json({ message, status: 404 });
      }
      const message = postId ? "Post retrieved successfully" : "List of posts";
      return res.status(200).json({ message, data: result, status: 200 });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Internal server error", data: err, status: 500 });
    }
  };
  getPostByUSerId = async (req, res) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return this.sendResponse(res, {
          message: "User ID not provided",
          status: 400,
        });
      }

      const posts = await PostModel.find({ user_id: userId });

      if (!posts || posts.length === 0) {
        return this.sendResponse(res, {
          message: "No posts found for the user",
          status: 404,
        });
      }

      return this.sendResponse(res, {
        message: "Posts retrieved successfully",
        data: posts,
        status: 200,
      });
    } catch (err) {
      console.error("Error fetching posts:", err);
      return this.sendResponse(res, {
        message: "Error fetching posts",
        data: err,
        status: 500,
      });
    }
  };

  getPostForUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const posts = await PostModel.find({ user_id: userId }).populate(
        "user_id"
      );

      if (posts.length === 0) {
        return res
          .status(404)
          .json({ message: "No posts found for the user", status: 404 });
      }

      return res
        .status(200)
        .json({ message: "List of posts", data: posts, status: 200 });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Internal server error", data: err, status: 500 });
    }
  };

  deletePostById = async (req, res) => {
    try {
      const postId = req.params.id;

      const deletedPost = await PostModel.findByIdAndDelete(postId);

      if (!deletedPost) {
        return this.sendResponse(res, {
          message: "Post not found",
          status: 404,
        });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };

  createPost = async (req, res) => {
    try {
      const { mediaUrls, text, id } = req.body;

      
      const user = await User.findOne({ _id: id });

      const newPost = new PostModel({
        mediaUrls,
        text,
        user_id: user._id,
      });

      await newPost.save();
      console.log(newPost);
      return this.sendResponse(res, {
        message: "Post Added successfully",
        data: newPost,
        status: 201,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Post Not Added!",
        data: err,
        status: 500,
      });
    }
  };

  reportPost = async (req, res) => {
    try {
      const { post_id } = req.params;
      const { description, user_id } = req.body;
      const post = await PostModel.findById({ _id: post_id });
      if (!post) {
        return this.sendResponse(res, {
          message: "Post not found",
          status: 404,
        });
      }

      const curr = await PostModel.findOne({ _id: post_id });
      const { reported_by } = curr;
      reported_by.push(user_id);
      const alterRepost = await PostModel.updateOne(
        { _id: post_id },
        { $set: { reported_by } }
      );
      if (alterRepost?.modifiedCount > 0) {
        const reportPost = new ReportPost({
          user_id,
          post_id,
          description,
        });

        await reportPost.save();

        return this.sendResponse(res, {
          message: "Post reported successfully",
          data: reportPost,
          status: 200,
        });
      }
      return this.sendResponse(res, {
        message: "Post reporting was not successfully",
        data: reportPost,
        status: 400,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal Server Error",
        status: 500,
      });
    }
  };

  postLikes = async (req, res) => {
    try {
      const { user_id, post_id } = req.body;
      const exist = await PostModel.findOne({ _id: post_id });
      if (!exist) {
        return this.sendResponse(res, {
          message: "Post not found",
          status: 404,
        });
      }
      const { likes } = exist;
      const responseBody = {};
      if (likes.includes(user_id)) {
        // Logic to remove user id
        const newLikes = likes.filter((item) => item.toString() !== user_id);
        const update = await PostModel.updateOne(
          { _id: post_id },
          { $set: { likes: newLikes } }
        );
        if (update?.modifiedCount > 0) {
          responseBody.message = "Post disliked";
          responseBody.status = 200;
        } else {
          responseBody.message = "Unable to dislike post";
          responseBody.status = 400;
        }
      } else {
        likes.push(user_id);
        const update = await PostModel.updateOne(
          { _id: post_id },
          { $set: { likes } }
        );
        if (update?.modifiedCount > 0) {
          responseBody.message = "Post liked";
          responseBody.status = 200;
        } else {
          responseBody.message = "Unable to like post";
          responseBody.status = 400;
        }
      }
      return this.sendResponse(res, responseBody);
    } catch (err) {
      return this.sendResponse(res, { message: "Like not added" });
    }
  };
  postComments= async (req, res )=>{
    try{
      const { text , user_id , post_id}=req.body;
      const exist = await PostModel.findOne({ _id: post_id });
      if (!exist) {
        return this.sendResponse(res, {
          message: "Post not found",
          status: 404,
        });
        
      }
      const update = await PostModel.updateOne(
        { _id: post_id },
        { $push: { comments: user_id } }
      );
      return this.sendResponse(res, {
        message: "comment added to post",
        status: 200,
      });
    }
    catch (err) {
      return this.sendResponse(res, { message: "Comment not added to post" });
    }
  }
}

module.exports = { Post };
