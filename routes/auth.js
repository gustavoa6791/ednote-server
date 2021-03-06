const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiKeysService = require('../services/apiKeys');
const UsersService = require('../services/users');
const EmailService = require('../services/email');

const validationHandler = require('../utils/middleware/validationHandler');
const { createUserSchema, createProviderUserSchema } = require('../utils/schemas/users');
const { config } = require('../config');
require('../utils/auth/strategies/basic');   // Basic strategy

function authApi(app) {

  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeysService = new ApiKeysService();
  const usersService = new UsersService();
  const emailService = new EmailService();

  router.post('/sign-in', async function (req, res, next) {
    const { apiKeyToken } = req.body;

    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', function (error, user) {
      try {
        if (error || !user || user == undefined) {
          next(error);
        }

        req.login(user, { session: false }, async function (error) {
          if (error) {
            next(error);
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          if (user != undefined) {
            const { _id: id, name, email, rol } = user;

            const payload = {
              sub: id,
              name,
              email,
              rol,
              scopes: apiKey.scopes
            };

            const token = jwt.sign(payload, config.authJwtSecret, {
              expiresIn: '15m'
            });

            return res.status(200).json({ token, user: { id, name, email, rol } });
          }
        });
      } catch (error) {
        next();
      }
    })(req, res, next);
  });


  router.post('/remember', async function (req, res, next) {
    try {
      const { email } = req.body.emailToRemember;
      await emailService.main(email).catch(console.error)

      res.status(200)

    } catch (error) {
      next(error);
    }
  });

  router.post('/unlock', async function (req, res, next) {
    try {

      
      
       const { data} = req.body.data;

       

       const newChance = { chance: [new Date(), 0] }

        await usersService.updateUser(data, newChance);
    

      res.status(200)

    } catch (error) {
      next(error);
    }
  });

  router.post('/change', async function (req, res, next) {
    try {
      const { email, password: password1, codigo } = req.body.data

      const userChange = await usersService.getUserForEmail(email);

      const { recovery } = userChange

      const diferencia = (new Date() - recovery[0]) / (1000 * 60)
      const codigoValido = (codigo == recovery[1])
      const codigoActivo = recovery[2]

      if(diferencia > 30 && codigoActivo && codigoValido){
       return next(boom.unauthorized("codigo caducado"))
      }

      if(diferencia <= 30 && !codigoActivo && codigoValido){
         return next(boom.unauthorized("codigo usado"))
      }

      if( !codigoValido){
        return next(boom.unauthorized("codigo no coincide"))
      }


      if (diferencia <= 30 && codigoValido && codigoActivo) {
       
        const newrecovery = { recovery: [recovery[0], recovery[1], false] }
        const newPassword = {password:await bcrypt.hash(password1, 10)}

        await usersService.updateUser(email, newrecovery);
        await usersService.updateUser(email, newPassword);
      }
          console.log("hola");
          
      res.status(200)

    } catch (error) {
      console.log(error);
      
      next(error)
    }
  });

  router.post('/search', async function (req, res, next) {

    const {data} = req.body
  
    try {
      var users = {}
      
      if(data.data != ""){
        
       users = await usersService.getUserForName(data);

      }

      if(data.data != ""){
        
        users = await usersService.getUserForName(data);
 
       }
       if(data.data == '@'){
        
        users = await usersService.getUserForName({ data: '' });
 
       }

      
      
      
     
      

      res.status(200).json({users});

    } catch (error) {
      next(error);
    }
  });

  router.post('/changeProfile', async function (req, res, next) {

    const {data} = req.body
  
    try {

      console.log(data)
      // const users = await usersService.getUserForName(data);

      // res.status(200).json({users});

    } catch (error) {
      next(error);
    }
  });

  router.post('/sign-up', validationHandler(createUserSchema), async function (req, res, next) {

    const { body: user } = req;

    try {
      const createdUserId = await usersService.createUser({ user });

      res.status(201).json({
        data: createdUserId,
        message: 'user created'
      });

    } catch (error) {
      next(error);
    }
  });

  router.post(
    '/sign-provider',
    validationHandler(createProviderUserSchema),
    async function (req, res, next) {
      const { body } = req;

      const { apiKeyToken, ...user } = body;

      if (!apiKeyToken) {
        next(boom.unauthorized('apiKeyToken is required'));
      }

      try {
        const queriedUser = await usersService.getOrCreateUser({ user });
        const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

        if (!apiKey) {
          next(boom.unauthorized());
        }

        const { _id: id, name, email } = queriedUser;

        const payload = {
          sub: id,
          name,
          email,
          scopes: apiKey.scopes
        };

        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '15m'
        });

        return res.status(200).json({ token, user: { id, name, email } });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = authApi;
