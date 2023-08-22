const mongoose = require("mongoose");
const { Comment } = require("./comment.model");

const postSchema = mongoose.Schema(
  {
    mediaUrls: {
      type: String,
    },
    text: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reported_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{type: mongoose.Schema.Types.ObjectId ,ref: "User"}]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
