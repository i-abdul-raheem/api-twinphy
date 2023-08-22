const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post_id: {
      type: String,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const Comment = new mongoose.model("Comment", commentSchema);
module.exports = { Comment };
