const { User } = require("../models");
const Response = require("./Response");
const { Types } = require("mongoose");

class Profile extends Response {
  changeProfilePicture = async (req, res) => {
    const oid = Types.ObjectId;
    const { profileImage, _id } = req.body;
    const request = await User.updateOne(
      { _id: new oid(_id) },
      { $set: { profileImage, avatar: profileImage } }
    );
    console.log({ profileImage, _id });
    console.log(request);
    if (request?.modifiedCount > 0) {
      const test = await User.findOne({ _id });
      console.log(test);
      return this.sendResponse(res, {
        message: "Profile image updated",
        data: { profileImage },
      });
    }
    return this.sendResponse(res, {
      message: "Profile image NOT updated",
      data: { request },
    });
  };
}

module.exports = { Profile };
