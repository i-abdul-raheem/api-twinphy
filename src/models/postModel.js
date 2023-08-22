const mongoose = require("mongoose");

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
    likes:[
      {type: mongoose.Schema.Types.ObjectId,
      }
    ]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = { Post };
