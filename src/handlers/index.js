const {Post}= require('./Post');
const { User } = require('./User');
const { Auth } = require('./Auth');
const { Chat } = require('./Chat');
const s3= require('./awsConfig');
module.exports = { s3,User, Auth, Chat ,Post};
