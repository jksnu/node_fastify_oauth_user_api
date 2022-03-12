const fastify = require('fastify');
const utils = require('../util/utils');

async function router (fastify, options) {
  fastify.post('/user/registerUser', (req, reply) => {  
    const username = req.body.username;
    const password = req.body.password;
    utils.addUser(username, password);
    reply.send({"message": 'User is registered successfully'});
  });
  
  fastify.get('/user/users', (req, reply) => {
    reply.send(utils.getUsers());
  });
  
  fastify.delete('/user/delete/:username', (req, reply) => {
    const username = req.params.username;
    const user = utils.getUser(username);
    utils.deleteUser(username);
    if(user && user.length > 0 && user[0].identityProvider) {
      utils.deactivateSession(user[0].identityProvider.idFromProvider);
    }  
    reply.send({"message":"User is deleted successfully"});
  });
  
  fastify.post('/user/login', (req, reply) => {
    const username = req.body.username;
    const password = req.body.password;
    utils.login(username, password);
    reply.send({"message": "User has logged in successfully"});
  });
  
  fastify.post('/user/logout', (req, reply) => {
    const username = req.body.username;
    utils.logout(username);
    utils.deactivateSession(req.authUser.id);
    reply.send({"message": "User has logged out successfully"});
  });
}

module.exports = router;