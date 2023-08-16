const Response = require('./Response');
const { Chat: ChatModel, User } = require('../models');

class Chat extends Response {
  sendMessage = async (req, res) => {
    try {
      const { text, media, sender, receiver } = req.body;
      if (!sender) {
        return this.sendResponse(res, {
          status: 400,
          message: 'Sender is required',
        });
      }
      if (!receiver) {
        return this.sendResponse(res, {
          status: 400,
          message: 'Receiver is required',
        });
      }
      if (!text && !media) {
        return this.sendResponse(res, {
          status: 400,
          message: 'Text/Media is required',
        });
      }
      const updateSeen = await ChatModel.updateMany(
        {
          isSeen: false,
          $and: [
            { $or: [{ sender }, { sender: receiver }] },
            { $or: [{ receiver }, { receiver: sender }] },
          ],
        },
        { $set: { isSeen: true } }
      );
      if (!updateSeen) {
        return this.sendResponse(res, {
          status: 500,
          message: 'Unkown error occured while updating messages status',
        });
      }
      const newMessage = new ChatModel({ text, media, sender, receiver });
      const request = await newMessage.save();
      if (request) {
        return this.sendResponse(res, { status: 201, message: 'Message Sent' });
      }
      return this.sendResponse(res, {
        status: 500,
        message: 'Unkown error occured',
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, {
        status: 500,
        message: new Error(err),
      });
    }
  };
  fetchMessages = async (req, res) => {
    try {
      const { receiver, sender } = req.query;
      if (!sender) {
        return this.sendResponse(res, {
          status: 400,
          message: 'Sender is required',
        });
      }
      if (!receiver) {
        return this.sendResponse(res, {
          status: 400,
          message: 'Receiver is required',
        });
      }
      const messages = await ChatModel.find({
        $and: [
          { $or: [{ sender }, { sender: receiver }] },
          { $or: [{ receiver }, { receiver: sender }] },
        ],
      }).populate(['sender', 'receiver']);
      if (messages) {
        return this.sendResponse(res, { status: 200, data: messages });
      }
      return this.sendResponse(res, {
        status: 500,
        message: 'Unkown error occured',
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, {
        status: 500,
        message: new Error(err),
      });
    }
  };
  getLastMessage = async (req, res) => {
    try {
      const { receiver, sender } = req.query;
      if (!sender) {
        return this.sendResponse(res, {
          status: 400,
          message: 'Sender is required',
        });
      }
      if (!receiver) {
        return this.sendResponse(res, {
          status: 400,
          message: 'Receiver is required',
        });
      }
      const messages = await ChatModel.find({
        $and: [
          { $or: [{ sender }, { sender: receiver }] },
          { $or: [{ receiver }, { receiver: sender }] },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate(['sender', 'receiver']);
      if (messages) {
        return this.sendResponse(res, { status: 200, data: messages });
      }
      return this.sendResponse(res, {
        status: 500,
        message: 'Unkown error occured',
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, {
        status: 500,
        message: new Error(err),
      });
    }
  };
  getUserChats = async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return this.sendResponse(res, {
          status: 400,
          message: 'User ID is required',
        });
      }
      const senderQuery = ChatModel.distinct('sender', { receiver: userId });
      const receiverQuery = ChatModel.distinct('receiver', { sender: userId });

      const [senders, receivers] = await Promise.all([
        senderQuery,
        receiverQuery,
      ]);

      const uniqueUsers = [...new Set([...senders, ...receivers])];
      const data = await User.find({ _id: { $in: uniqueUsers } });
      if (uniqueUsers) {
        return this.sendResponse(res, {
          status: 200,
          data,
        });
      }
      return this.sendResponse(res, {
        status: 500,
        message: 'Unkown error occured',
      });
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, {
        status: 500,
        message: new Error(err),
      });
    }
  };
}

module.exports = { Chat };
