// const postModel = require("../models/postModel");
const Response = require("./Response");
const { Post: PostModel } = require("../models/postModel");
const mongoose = require("mongoose");

class Post extends Response {
  getAllPosts = async (req, res) => {
    try {
      console.log("i am in");
      const posts = await PostModel.find({});

      if (posts.length < 1) {
        return this.sendResponse(res, "No posts found", null);
      }
      res.json(posts);
    } catch (err) {
      return this.sendResponse(res, "Internal Server Error", err, 500);
    }
  };

  getPostById = async (req, res) => {
    try {
      const postId = req.params.id;

      const post = await PostModel.findById(postId);

      if (!post) {
        return this.sendResponse(res, "Post not found", null, 404);
      }

      res.json(post);
    } catch (err) {
      return this.sendResponse(res, "Internal Server Error", null, 500);
    }
  };

  deletePostById = async (req, res) => {
    try {
      const postId = req.params.id;

      const deletedPost = await PostModel.findByIdAndDelete(postId);

      if (!deletedPost) {
        return this.sendResponse(res, "Post not found", null, 404);
      }

      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      return this.sendResponse(res, "Internal Server Error", null, 500);
    }
  };

  createPost = async (req, res) => {
    try {
      const newPostData = req.body;
      const newPost = new PostModel(newPostData);
      await newPost.save();
     
      if(newPost){
      return this.sendResponse(res, "Post Created!", newPost, 201);
      }
    } catch (error) {
      
      return this.sendResponse(
        res,
        "An error occurred while creating the post.",
        null,
        500
      );
    }
  };
}

module.exports = { Post };
