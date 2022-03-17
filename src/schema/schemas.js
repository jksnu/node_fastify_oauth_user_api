'use strict'

const S = require('fluent-json-schema');

const registerUserSchema = {
  description: 'registerUser',
  summary: 'User Registration',
  tags: ['User'],
  body: S.object()
    .additionalProperties(false)
    .prop('username', S.string().required())
    .prop('password', S.string().required()),
  response: {
    200: S.object()
      .additionalProperties(false)
      .prop('message', S.string()),
    401: S.object().prop('message', S.string()),
  },
}

const UsersSchema = {
  description: 'users',
  summary: 'Users List',
  tags: ['User'],
  response: {
    200: S.array().items(
      S.object()
        .additionalProperties(false)
        .prop('username', S.string())
        .prop('password', S.string())
        .prop('loggedIn', S.boolean())
    ),
    401: S.object().prop('message', S.string()),
  },
}

const deleteUserSchema = {
  description: 'deleteUser',
  summary: 'Delete User',
  tags: ['User'],
  params: S.object()
    .additionalProperties(false)
    .prop('username', S.string().required()),    
  response: {
    200: S.array().items(
      S.object()
       .additionalProperties(false)
        .prop('username', S.string())
        .prop('password', S.string())
        .prop('loggedIn', S.boolean())
    ),
    401: S.object().prop('message', S.string()),
  },
}

const loginSchema = {
  description: 'userLogin',
  summary: 'User Login',
  tags: ['User'],
  body: S.object()
    .additionalProperties(false)
    .prop('username', S.string().required())
    .prop('password', S.string().required()),
  response: {
    200: S.object()
      .additionalProperties(false)
      .prop('message', S.string()),
    401: S.object().prop('message', S.string()),
  },
}

const logoutSchema = {
  description: 'userLogout',
  summary: 'User Logout',
  tags: ['User'],
  body: S.object()    
    .additionalProperties(false)
    .prop('username', S.string().required()),
  response: {
    200: S.object()
      .additionalProperties(false)
      .prop('message', S.string()),
    401: S.object().prop('message', S.string()),
  },
}

module.exports = {
  registerUserSchema, UsersSchema, deleteUserSchema, loginSchema, logoutSchema
}

