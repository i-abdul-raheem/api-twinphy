
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
        return this.sendResponse(res, {message:"Post not found", status: 404});
      }

      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      return this.sendResponse(res, {message:"Internal Server Error", status: 500});
    }
  };

  createPost = async (req, res) => {
    try {
      const newPostData = req.body;
      const { text, user_id } = newPostData;
      let mediaUrls = {};
  
      if (req.file) {
        
        const file = req.file;
        console.log(file)
        const params = {
          Bucket: 'twinphy-v2',
          Key: `uploads/${Date.now()}-${file.originalname}`,
          Body: file.buffer,
        };
  
        const s3Response = await s3.upload(params).promise();
        mediaUrls = {
          public_id: s3Response.Key,
          url: s3Response.Location,
        };
      }
  
    
      const newPost = new PostModel({ text, user_id, mediaUrls });
      const savedPost = await newPost.save();
  
      return this.sendResponse(res, { message: "Post Created!", status: 201 });
    } catch (error) {
      console.error("Error creating post:", error);
      return this.sendResponse(res, { message: "An error occurred while creating the post.", status: 500 });
    }
  };
  
  
  
  
}

module.exports = { Post };
