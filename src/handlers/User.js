const Response = require("./Response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User: UserModel } = require("../models");

class User extends Response {
  getUser = async (req, res) => {
    try {
      const userId = req.query.id;
      if (!userId) {
        const userData = await UserModel.find({});

        if (!userData) {
          return this.sendResponse(res, {
            message: "No Users found",
            status: 404,
          });
        }

        return this.sendResponse(res, {
          message: "List of users",
          data: { userData },
          status: 200,
        });
      }

      const userData = await UserModel.find({ _id: userId });

      if (!userData) {
        return this.sendResponse(res, {
          message: "User not found",
          status: 404,
        });
      }

      return this.sendResponse(res, {
        message: "Current User",
        data: { userData },
        status: 200,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedData = req.body;

      if (updatedData.password) {
        const hashedPassword = await bcrypt.hash(updatedData.password, 10);
        updatedData["password"] = hashedPassword;
      }
      // prevent from upadting email
      if (updatedData.email) {
        delete updatedData.email;
      }

      const user = await UserModel.findOne({ _id: userId });

      if (!user) {
        return this.sendResponse(res, {
          message: "User not found",
          status: 404,
        });
      }

      await UserModel.updateOne({ _id: userId }, { $set: updatedData });
      return this.sendResponse(res, {
        message: "User Updated successfully",
        data: { user },
        status: 202,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };

  blockUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { isActive } = req.body;

      const user = await UserModel.findOne({ _id: userId });

      if (!user) {
        return this.sendResponse(res, {
          message: "User not found",
          status: 404,
        });
      }
      console.log(user?.isActive === isActive);
      if (user?.isActive === isActive) {
        return this.sendResponse(res, {
          message: `Active_Status of ${user.userName} is already ${isActive}`,
          status: 208,
        });
      }

      await UserModel.updateOne(
        { _id: userId },
        { $set: { isActive: isActive } }
      );
      return this.sendResponse(res, {
        message: "User Updated successfully",
        data: { user },
        status: 202,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = await UserModel.find({ _id: userId });
      const result = await UserModel.deleteOne({ _id: userId });

      if (result.deletedCount === 0) {
        return this.sendResponse(res, {
          message: "User not found",
          status: 404,
        });
      }

      return this.sendResponse(res, {
        message: "User Removed successfully",
        data: { userData },
        status: 202,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };

  restrictUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { block_user_id } = req.body;

      const user = await UserModel.findOne({ _id: userId });

      if (!user) {
        return this.sendResponse(res, {
          message: "User not found",
          status: 404,
        });
      }

      const { blocked } = user;

      if (blocked.includes(block_user_id)) {
        return this.sendResponse(res, {
          message: "Already blocked this user",
          status: 400,
        });
      }

      blocked.push(block_user_id);
      const blockNew = await UserModel.updateOne(
        { _id: userId },
        { $set: { blocked } }
      );

      return this.sendResponse(res, {
        message: "User Updated successfully",
        data: blocked,
        status: 202,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };

  unRestrictUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { block_user_id } = req.body;

      const user = await UserModel.findOne({ _id: userId });

      if (!user) {
        return this.sendResponse(res, {
          message: "User not found",
          status: 404,
        });
      }

      const { blocked } = user;

      if (!blocked.includes(block_user_id)) {
        return this.sendResponse(res, {
          message: "This User is not blocked",
          status: 400,
        });
      }

      const updated = blocked.filter((id) => id.toString() !== block_user_id);

      const blockNew = await UserModel.updateOne(
        { _id: userId },
        { $set: { blocked: updated } }
      );

      return this.sendResponse(res, {
        message: "User Updated successfully",
        data: updated,
        status: 202,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };

  followUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { follow_user_id } = req.body;
      console.log(follow_user_id)

      const currentuser = await UserModel.findOne({ _id: userId });
      const toOtherUser = await UserModel.findOne({ _id: follow_user_id });

      if (!currentuser && !toOtherUser) {
        return this.sendResponse(res, {
          message: "User not found",
          status: 404,
        });
      }

      const { followings, _id } = currentuser;
      const { followers } = toOtherUser;

      if (followings.includes(follow_user_id) && followers.includes(_id)) {
        const updateFollow = followings.filter(
          (id) => id.toString() !== follow_user_id
        );
        const updateFollower = followers.filter(
          (id) => id.toString() !== _id.toString()
        );

        // following
        await UserModel.updateOne(
          { _id: userId },
          { $set: { followings: updateFollow } }
        );

        // followers
        await UserModel.updateOne(
          { _id: follow_user_id },
          { $set: { followers: updateFollower } }
        );

        const data = await UserModel.findOne({ _id: userId }).populate([
          "followings",
          "followers",
        ]);

        return this.sendResponse(res, {
          message: "User unfollow successfully",
          data: {
            followings: data.followings,
            followers: data.followers,
          },
          status: 200,
        });
      }

      followings.push(follow_user_id);
      // following
      await UserModel.updateOne({ _id: userId }, { $set: { followings } });

      followers.push(_id);
      // followersNew
      await UserModel.updateOne(
        { _id: follow_user_id },
        { $set: { followers } }
      );
      
      const data = await UserModel.findOne({ _id: userId }).populate([
        "followings",
        "followers",
      ]);

      return this.sendResponse(res, {
        message: "User follow successfully",
        data: {
          followings: data.followings,
          followers: data.followers,
        },
        status: 202,
      });
    } catch (err) {
      console.log(err)
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };
}

module.exports = {
  User,
};
