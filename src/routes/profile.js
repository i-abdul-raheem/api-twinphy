const router = require("express").Router();
const { Profile } = require("../handlers");
const { auth } = require("../middlewares");

const handler = new Profile();

router.patch("/update-picture", handler.changeProfilePicture);

module.exports = router;
