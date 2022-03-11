const fastify = require('fastify');
const utils = require('../util/utils');

async function router (fastify, options) {
  fastify.post('/registerUser', (req, reply) => {  
    const username = req.body.username;
    const password = req.body.password;
    utils.addUser(username, password);
    reply.send('User is registered successfully');
  });
  
  fastify.get('/users', (req, reply) => {
    reply.send(utils.getUsers());
  });
  
  fastify.delete('/delete/:username', (req, reply) => {
    const username = req.params.username;
    const user = utils.getUser(username);
    utils.deleteUser(username);
    if(user && user.length > 0 && user[0].identityProvider) {
      utils.deactivateSession(user[0].identityProvider.idFromProvider);
    }  
    reply.send("User is deleted successfully");
  });
  
  fastify.post('/login', (req, reply) => {
    const username = req.body.username;
    const password = req.body.password;
    utils.login(username, password);
    reply.send("User has logged in successfully");
  });
  
  fastify.post('/logout', (req, reply) => {
    const username = req.body.username;
    utils.logout(username);
    utils.deactivateSession(req.authUser.id);
    reply.send("User has logged out successfully");
  });
}

module.exports = router;