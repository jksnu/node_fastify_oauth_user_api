'use strict';

const { 
  registerUser, 
  users, 
  deleteUser,
  login, 
  logout
} = require('../controller/user_ctrl');

const {
  registerUserSchema, 
  UsersSchema,
  deleteUserSchema,
  loginSchema,
  logoutSchema
} = require('../schema/schemas');

async function router (fastify, options) {
  console.log(options);

  fastify.route({
    method: 'POST',
    url: '/registerUser', 
    schema: registerUserSchema,
    handler: registerUser
  });
  
  fastify.route({
    method: 'GET',
    url: '/users', 
    schema: UsersSchema,
    handler: users
  });

  fastify.route({
    method: 'DELETE',
    url: '/delete/:username', 
    schema: deleteUserSchema,
    handler: deleteUser
  });

  fastify.route({
    method: 'POST',
    url: '/login', 
    schema: loginSchema,
    handler: login
  });

  fastify.route({
    method: 'POST',
    url: '/logout', 
    schema: logoutSchema,
    handler: logout
  });
}

module.exports = router;