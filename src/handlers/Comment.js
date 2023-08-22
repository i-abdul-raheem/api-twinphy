const Response=require('./Response');
const{Comment: CommentModel}= require('../models/comment.model');

class Comment extends Response {
    createComment=async (req, res)=>{
        try{
            const {post_id, user_id, text}= req.body;
            const newComment = new CommentModel({
                text,
                user_id,
                post_id
            });
            await newComment.save();
            console.log(newComment);
            return this.sendResponse(res, {
                message: "Comment Created successfully",
                data: newComment,
                status: 201,
              });
        }
        catch(error){
            return this.sendResponse(res, {
                message: "Comment Not Created ",
                data: err,
                status: 500,
              });
        }
    }
}

module.exports= {Comment}