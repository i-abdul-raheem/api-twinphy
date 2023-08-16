const router = require('express').Router();
const { Auth } = require('../handlers');

const handler = new Auth();

router.get('/', handler.refresh);
router.post('/', handler.createProfile);
router.post('/login', handler.login);

module.exports = {
  auths: router,
};
