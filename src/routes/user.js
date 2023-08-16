const router = require("express").Router();
const { User } = require("../handlers");

const handler = new User();

// router.get("/", handler.getUser);

module.exports = {
  users: router,
};
