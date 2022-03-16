'use strict';

const utils = require('../util/utils');

 // eslint-disable-next-line no-unused-vars
const registerUser = (req, reply) => {
  const username = req.body.username;
  const password = req.body.password;
  utils.addUser(username, password);
  return{"message": 'User is registered successfully'};
}

// eslint-disable-next-line no-unused-vars
const users = (req, reply) => {
  return utils.getUsers();
}

// eslint-disable-next-line no-unused-vars
const deleteUser = (req, reply) => {
  const username = req.params.username;
  const user = utils.getUser(username);
  utils.deleteUser(username);
  if(user && user.length > 0 && user[0].identityProvider) {
    utils.deactivateSession(user[0].identityProvider.idFromProvider);
  }  
  return {"message":"User is deleted successfully"};
}

// eslint-disable-next-line no-unused-vars
const login = (req, reply) => {
  const username = req.body.username;
  const password = req.body.password;
  utils.login(username, password);
  return {"message": "User has logged in successfully"};
}

// eslint-disable-next-line no-unused-vars
const logout = (req, reply) => {
  const username = req.body.username;
  utils.logout(username);
  utils.deactivateSession(req.authUser.id);
  return {"message": "User has logged out successfully"};
}

module.exports = {
  registerUser, users, deleteUser, login, logout
}