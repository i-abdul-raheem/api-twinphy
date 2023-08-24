const Response = require("./Response");
const { Comment: CommentModel } = require("../models/comment.model");
const { Post: PostModel } = require("../models/");

class Comment extends Response {
  createComment = async (req, res) => {
    try {
      const { post_id, user_id, text } = req.body;
      const newComment = new CommentModel({
        text,
        user_id,
        post_id,
      });
      const newCommentData = await newComment.save();
      console.log(newCommentData, newCommentData?._id);
      const post = await PostModel.findOne({ _id: post_id.toString() });

      if (!post) {
        return this.sendResponse(res, {
          message: "Post Not Found",
          status: 404,
        });
      }
      const { comments } = post;
      comments.push(newCommentData?._id);
      const updatePost = await PostModel.updateOne(
        { _id: post_id.toString() },
        { $set: { comments } }
      );
      if (updatePost.modifiedCount > 0)
        return this.sendResponse(res, {
          message: "Comment Created successfully",
          data: newComment,
          status: 201,
        });
      return this.sendResponse(res, {
        message: "Comment Not Created",
        data: newComment,
        status: 400,
      });
    } catch (error) {
      return this.sendResponse(res, {
        message: "Comment Not Created ",

        status: 500,
      });
    }
  };
  getCommentByPostId = async (req, res) => {
    try {
      const post_id = req.params.id;
      const comments = await CommentModel.find({ post_id }).populate([
        "user_id",
        "post_id",
      ]);

      if (comments.length === 0) {
        return this.sendResponse(res, {
          message: "Comments not found",

          status: 404,
        });
      }
      return this.sendResponse(res, {
        message: "Comments List",
        data: comments,
        status: 200,
      });
    } catch (error) {
      return this.sendResponse(res, {
        message: "INternal server error ",

        status: 500,
      });
    }
  };
}
module.exports = { Comment };
