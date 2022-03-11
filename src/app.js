const fastify = require('fastify')({
  logger: true
})
const dotenv = require('dotenv');
const path = require('path');
//const csrf = require('csurf');
const createError = require('http-errors');
const authMiddleWare = require('./middleware/auth');
const fastify_cors = require('fastify-cors');

const port = 8000;

dotenv.config({
  path: path.join(__dirname, '../.env')
});

async function load() {
  
  // if you want to sign cookies:
  //fastify.register(require('fastify-cookie'), { secret: process.env.CSRF_SECRET }); // See following section to ensure security
  //fastify.register(require('fastify-csrf'), { cookieOpts: { signed: true } });


  await fastify.register(require('fastify-cookie'));
  await fastify.register(require('fastify-csrf'), {ignoreMethods:['GET', 'HEAD', 'OPTIONS']});
  // protect the entire plugin
  fastify.addHook('onRequest', fastify.csrfProtection);

  //middleware
  /*app.use(express.json()); 
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());*/

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

  //app.use('/user', authMiddleWare.authenticate, userRoute); //user routes

  fastify.register(require('./routes/user_routes'));

  //routes
  fastify.get('/', async (req, reply) => {
    const token = await reply.generateCsrf();
    reply.setCookie('XSRF-TOKEN', token, { httpOnly: false });
    //res.cookie('XSRF-TOKEN', token, { httpOnly: false });
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



  fastify.listen(port, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }  
  })
}

load();


