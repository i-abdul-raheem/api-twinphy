const router = require("express").Router();
const { User } = require("../handlers");
const { auth } = require("../middlewares");

const handler = new User();

router.get("/", handler.getUser);
router.put("/:id", auth, handler.updateUser);
router.patch("/:id", auth, handler.blockUser);
router.delete("/:id", auth, handler.deleteUser);

module.exports = {
  users: router,
};
