const { timeStamp } = require('console');
const mongoose = require('mongoose');

const commentSchema= mongoose.Schema({
    text:{
        type:String
    },
    media:{
        type:String
    },
    postId:{
        type:String
    }
},{timestamps:true});


const Comment = new mongoose.model('Comment', commentSchema);
module.exports= {Comment}