const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const UsersService = require('../../../services/users');

passport.use(
  new BasicStrategy(async function(email, password, cb) {
    const userService = new UsersService();

    try {
      const user = await userService.getUser({ email });

      if (!user) {
        return cb(boom.unauthorized('usuarioContraseña'), false);
      }

      const diferencia = (new Date() - user.chance[0]) / (1000*60)

      if (user.chance[1] >= 3  && diferencia < 20 ){
        return cb(boom.unauthorized("usuarioBloqueado"),false)

      }

      if (!(await bcrypt.compare(password, user.password))) {

        const userEmail = user.email
        const hora = {chance: [new Date(),user.chance[1]+1] }
        
        await userService.updateUser(userEmail,hora); 
    
        return cb(boom.unauthorized('usuarioContraseña', false));
      }

      const hora = {chance: [new Date(),user.chance[1] = 0 ] }
      await userService.updateUser(user.email ,hora)
      delete user.password;

      return cb(null, user);

    } catch (error) {
      
      return cb(error, false);
    }
  })
);
