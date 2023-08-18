const Response = require("./Response");
const { User } = require("../models");
const mongoose = require("mongoose");
const { Post: PostModel } = require("../models/postModel");
const AWS = require("aws-sdk");

class Post extends Response {
  getAllPosts = async (req, res) => {
    try {
      const postId = req.params.id;
      let result;

      if (!postId) {
        // Fetch all posts
        result = await PostModel.find({}).populate("user_id");
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
      return res
        .status(500)
        .json({ message: "Internal server error", data: err, status: 500 });
    }
  };

  getPostByUSerId = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
      return this.sendResponse(res, { message: "Post Not found", status: 404 });
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

  // createPost = async (req, res) => {
  //   try {
  //     const newPostData = req.body;
  //     const { text, user_id } = newPostData;
  //     let mediaUrls = null; // Initialize mediaUrls as null

  //     if (req.file) {
  //       const file = req.file;
  //       const params = {
  //         Bucket: 'twinphy-v2',
  //         Key: `uploads/${Date.now()}-${file.originalname}`,
  //         Body: file.buffer,
  //       };

  //       const s3Response = await s3.upload(params).promise();
  //       mediaUrls = {  // Set mediaUrls as an object if file is uploaded
  //         public_id: s3Response.Key,
  //         url: s3Response.Location,
  //       };
  //     }

  //     const newPost = new PostModel({ text, user_id, mediaUrls });
  //     const savedPost = await newPost.save();

  //     return this.sendResponse(res, { message: "Post Created!", status: 201 });
  //   } catch (error) {
  //     console.error("Error creating post:", error);
  //     return this.sendResponse(res, { message: "An error occurred while creating the post.", status: 500 });
  //   }
  // };

  createPost = async (req, res) => {
    try {
      const { mediaUrls, text } = req.body;
      const userId = req.params.id;
      console.log(userId);
      const user = await User.findOne({ _id: userId });
      console.log(user);
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

  // createPost = async (req, res) => {
  //   try {
  //     const { mediaUrls, text } = req.body;
  //     const user_id = req.user.id; // Assuming user's ID is available in req.user

  //     const newPost = new PostModel({
  //       mediaUrls,
  //       text,
  //       user_id,
  //     });

  //     const savedPost = await newPost.save();

  //     if (savedPost) {
  //       return this.sendResponse(res, { message: "Post Created!", status: 201 });

  //     }
  //   } catch (error) {
  //     return this.sendResponse(res, { message: "An error occurred while creating the post.", status: 500 });

  //   }
  // };
}

module.exports = { Post };
