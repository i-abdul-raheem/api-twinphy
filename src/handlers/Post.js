const Response = require("./Response");
const { User } = require("../models");
const mongoose = require("mongoose");
const { Post: PostModel } = require("../models/postModel");
const AWS = require("aws-sdk");

class Post extends Response {
  getAllPosts = async (req, res) => {
    try {
      const postId = req.params?.id;
      let result;
      if (!postId) {
        // Fetch all posts
        result = await PostModel.find({}).sort({ updatedAt: -1 }).populate("user_id");
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

      console.log(id);
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
}

module.exports = { Post };
