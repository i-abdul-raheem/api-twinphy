
const Response = require("./Response");
const { Post: PostModel } = require("../models/postModel");
const mongoose = require("mongoose");
const AWS= require('aws-sdk');

class Post extends Response {
  getAllPosts = async (req, res) => {
    try {
      const postId = req.query.id;
      if (!postId) {
        const posts = await PostModel.find({});
        
        if (!posts || posts.length === 0) {
          return this.sendResponse(res, {
            message: 'No Posts found',
            status: 404,
          });
        }
  
        return this.sendResponse(res, {
          message: 'List of posts',
          data: { posts },
          status: 200,
        });
      }
  
      const postById = await PostModel.find({ _id: postId });
  
      if (!postById || postById.length === 0) {
        return this.sendResponse(res, {
          message: 'Post not found',
          status: 404,
        });
      }
  
      return this.sendResponse(res, {
        message: 'Current Post',
        data: { postById },
        status: 200,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: 'Internal server error!',
        data: err,
        status: 500,
      });
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
     
      const{file}= req.body.mediaUrls;
      console.log(req.body)
      console.log(file);
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
