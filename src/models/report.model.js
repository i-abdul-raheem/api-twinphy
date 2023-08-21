const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const ReportPost = mongoose.model("ReportPost", reportSchema);
module.exports = { ReportPost };
