const { Comment } = require("../handlers/Comment");

const router = require("express").Router();
const handler= new Comment();


router.post('/', handler.createComment);

module.exports={comment:router}