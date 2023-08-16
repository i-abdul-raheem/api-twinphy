const Response = require("./Response");
const { User: UserModel } = require("../models");

class User extends Response {}

module.exports = {
  User,
};
