const { Chat } = require('../handlers');

const router = require('express').Router();
const handler = new Chat();
router.post('/', handler.sendMessage);
router.get('/', handler.fetchMessages);
router.get('/last', handler.getLastMessage);
router.get('/list', handler.getUserChats);

module.exports = router;
