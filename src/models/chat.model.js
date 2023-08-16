const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    media: {
      type: String,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat };
