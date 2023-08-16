const mongoose= require('mongoose');

const postSchema= mongoose.Schema({
    mediaUrls:{
        type:String
    },
    text:{
        type:String
    },
    user_id:{
        type :String
    }
}, {timestamps:true})

const Post = mongoose.model('Post', postSchema);
module.exports={Post}