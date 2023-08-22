const { timeStamp } = require('console');
const mongoose = require('mongoose');

const commentSchema= mongoose.Schema({
    text:{
        type:String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    post_id:{
        type:String
    }
},{timestamps:true});


const Comment = new mongoose.model('Comment', commentSchema);
module.exports= {Comment}