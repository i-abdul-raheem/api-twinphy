const { Comment } = require("../handlers/Comment");

const router = require("express").Router();
const handler= new Comment();


router.post('/', handler.createComment);
router.get('/:id', handler.getCommentByPostId)
module.exports={comment:router}