const router = require('express').Router();
const { User } = require('../handlers');
const { auth } = require('../middlewares');

const handler = new User();

router.get('/', handler.getUser);
router.put('/:id', handler.updateUser);
router.patch('/:id', handler.blockUser);
router.delete('/:id', handler.deleteUser);

module.exports = {
  users: router,
};
