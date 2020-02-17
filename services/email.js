const MongoLib = require('../lib/mongo');
const UserService = require('./users')
const nodemailer = require("nodemailer");
const { config } = require('../config/index');


class EmailService {
    constructor() {
        this.collection = 'users';
        this.mongoDB = new MongoLib();
        this.userService = new UserService();
    }

    generadorCodigo(){
        var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
        var codigo = "";
        for (var i=0; i<20; i++) codigo +=caracteres.charAt(Math.floor(Math.random()*caracteres.length)); 
       return codigo
    }

  
    async main(email) {

        const user = await this.mongoDB.getForEmail(this.collection, email);

        const { email: emailOther, name, recovery } = user
        const codigo = this.generadorCodigo()

        const activacion = {recovery:[ new Date, codigo , true ]}
        await this.userService.updateUser( emailOther,activacion); 

        const contentHTML = `
        <h1>Saludos</h1>
        <p>Acabas de solicitar el cambio de tu contraseña </p>
        <p>En este correo se encuentra el codigo que tiene </p>
        <p>una validez de 30 minutos para ser usado  </p>
        <ul>
            <li>Correo: ${emailOther}</li>
            <li>Nombre: ${name}</li>
            <li>Codigo: ${codigo}</li>
        </ul>
       `
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:  config.serverEmail,
                pass:  config.serverEmailPassword
            }
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({

            from: config.serverEmail, // sender address
            to: emailOther, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: contentHTML // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com

    }


}

module.exports = EmailService;
