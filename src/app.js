'use strict';

const fastify = require('fastify')({
  logger: true,
  bodyLimit: 1024*1024*10 //10 mb body limit
})
const dotenv = require('dotenv');
const path = require('path');
const authMiddleWare = require('./middleware/auth');
const fastify_cors = require('fastify-cors');
const helmet = require('fastify-helmet');

const port = 8000;

dotenv.config({
  path: path.join(__dirname, '../.env')
});

async function load(fastify) {
  
  await fastify.register(require('fastify-cookie'));
  await fastify.register(require('fastify-csrf'));
  //registering helmet 
  await fastify.register(helmet, { global: true });  

  //csrf middle ware
  //var csrfProtection = csrf({ cookie: true });
  /*app.all('*', (req, res, next) => {
    if(process.env.NODE_ENV === 'development') {
      return next();
    } else {
      return csrfProtection(req, res, next);
    }
  }, (req, res, next) => {
    //res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  });*/
  //app.use(csrfProtection);

  //CORS middle ware
  const corsOptions = {
    origin: (origin, callback) => {
      if (process.env.ALLOWED_ORIGINS && process.env.NODE_ENV !== 'development') {
        const whiteList = process.env.ALLOWED_ORIGINS.split(',');
        if(whiteList.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        callback(null, true);
      }
    },
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTION'],
    allowedHeaders: [
      'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'csrf-token',
      'xsrf-token', 'x-csrf-token', 'x-xsrf-token'
    ]
  }
  fastify.register(fastify_cors, corsOptions);

  fastify.register(require('./routes/user_routes', {
    'onRequest': fastify.csrfProtection
  }), {    
    prefix: '/user',
  });

  fastify.addHook('preHandler', (req, reply, done) => {
    authMiddleWare.authenticate(req, reply, done);
  });

  //code for removing x-powered-by header from response header
  const HEADER = 'X-Powered-By';
  fastify.addHook('onSend', (request, reply, payload, done) => {
		reply.header(HEADER, "");
		done();
	});

  //routes
  fastify.get('/', async (req, reply) => {
    const token = await reply.generateCsrf();
    reply.setCookie('XSRF-TOKEN', token, { httpOnly: false });
    reply.send({"status": "Success", "message": "Hello world"});
  });

  //handling unhandled error
  /*app.use((err, req, res, next) => {
    if (err.code == 'EBADCSRFTOKEN') {
      // handle CSRF token errors here
      res.status(403).json({ code: 403, message: err.message });
    } else {
      return next(createError(404));
    } 
  });*/
  fastify.setErrorHandler(function (error, request, reply) {
    // Log error
    this.log.error(error)
    if(error.name === "ForbiddenError") {
      reply.status(403).send({ code: 403, message: error.message });
    }
    reply.status(409).send({ code: 409, message: error.message })
  })
  
  fastify.listen(port, function (err) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }  
  })
}

load(fastify);


