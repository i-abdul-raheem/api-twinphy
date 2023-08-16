const mongoose= require('mongoose');

const postSchema= mongoose.Schema({
    mediaUrls:{
        public_id:{
            type:String
        },
        url:{
            type:String
        }
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