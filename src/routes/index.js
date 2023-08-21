const router = require("express").Router();
const { auths } = require("./auth");
const { users } = require("./user");
const { posts } = require("./posts");
const chat = require("./chat");
const upload = require("./file");
const profile = require("./profile");
const { reports } = require("./report");

router.use("/auths", auths);
router.use("/users", users);
router.use("/posts", posts);
router.use("/reports", reports);
router.use("/chat", chat);
router.use("/upload", upload);
router.use("/profile", profile);

module.exports = { router };
