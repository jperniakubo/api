import {ConstantsManager} from '../app/constants/constantsManager';

const nodemailer = require('nodemailer');

export default class KpmgMailer {
  GmailTransport: any;
  mailFrom: any;
  supportMailTo: any;
  private constantsManager: ConstantsManager = new ConstantsManager();
  baseUrlApiApp: any;
  constructor() {
    this.GmailTransport = {
      host: 'gomxema2.go.kworld.kpmg.com',
      port: 25,
      secure: false,
      auth: {
        user: 'onekey@kpmg.com',
        pass: ''
      }
    };
    this.mailFrom = 'onekey@kpmg.com';
    this.supportMailTo = 'CO-DLHelpdesk@kpmg.com';
    this.baseUrlApiApp = this.constantsManager.getBaseUrl();
  }

  public async SendEmailTest() {
    nodemailer.createTestAccount(() => {
      const transporter = nodemailer.createTransport(this.GmailTransport);
      const mailOptions = {
        from: this.mailFrom,
        to: this.supportMailTo,
        subject: 'Hello ✔ - Prueba de envío',
        text: 'Hello world?',
        html: '<b>Hello world?</b>'
      };
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
    });
  }

  public async ticketSupportEmail(
    userName: string,
    email: string,
    message: string,
    anio: string
  ) {
    nodemailer.createTestAccount(() => {
      const transporter = nodemailer.createTransport(this.GmailTransport);
      const mailOptions = {
        from: this.mailFrom,
        to: this.supportMailTo,
        subject: `KPMG - Ticket de soporte`,
        html: `<!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                    <title>One Key - KPMG - Ticket de soporte</title>
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
                    <style>
                        @media screen {
                            * {
                                align-items: center;
                                margin: auto;
                                text-align: center;
                                font-family: "Roboto", sans-serif;
                                font-weight: 400;
                            }
                            body {
                                font-family: "Roboto", sans-serif;
                            }
                            .body {
                                width: 100%;
                                max-width: 100%;
                                background-color: #F4F6FC;
                            }
                            .header {
                                background: url() no-repeat;
                                margin: auto;
                                color: white;
                            }
                            .greetings {
                                color: #00338D;
                                font-weight: 900;
                            }
                            .greetings2 {
                                color: #00A3A1;
                                font-weight: 900;
                            }
                            .marginBottom{
                                margin-bottom: 40px;
                            }
                            .container {
                                width: 80%;
                                background-color: #ffffff;
                                font-family: "Roboto", sans-serif;
                                color: #030711;
                                padding-top: 30px;
                                margin-top: 30px;
                                margin-bottom: 30px;
                            }
                            .my-auto {
                                margin: 50px auto;
                            }
                            .py-auto {
                                padding-top: 200px;
                                padding-bottom: 90px;
                            }
                            .footer {
                                background-image: linear-gradient(#02338D, #03499F);
                                color: white;
                            }
                            .button {
                                background-color: #020B50;
                                -webkit-border-radius: 14px;
                                -moz-border-radius: 14px;
                                border-radius: 14px;
                                display: inline-block;
                                cursor: pointer;
                                color: #ffffff !important;
                                font-family: 'Roboto';
                                font-size: 18px;
                                font-weight: bold;
                                padding: 10px 76px;
                                margin: 30px auto;
                                text-decoration: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="body">
                        <div class="header">
                            <img src="${this.baseUrlApiApp}imgEmail/header.png" alt="" style="width: 100%;">
                        </div>
                        <div class="container">
                            <div class="my-auto">
                                <h1 class="greetings marginBottom">
                                    KPMG - Nuevo ticket de soporte
                                </h1>
                                <h2 class="greetings marginBottom">
                                    Ticket: ${message}
                                </h2>
                                <h3 class="greetings2 marginBottom">
                                    Usuario: ${userName}
                                </h3>
                                <h3 class="greetings2">
                                    ${email}
                                </h3>
                            </div>
                        </div>
                        <div class="footer">
                            <small>© ${anio} KPMG - Todos los derechos reservados.</small>
                        </div>
                    </div>
                </body>
                </html>`
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
    });
  }

  public async reservationEmail(
    title: string,
    message: string,
    numberReservation: string,
    fullName: string,
    userEmail: string,
    anio: string,
    office: string,
    building: string,
    officeType: string,
    floor: string,
    time: string
  ) {
    nodemailer.createTestAccount(() => {
      const transporter = nodemailer.createTransport(this.GmailTransport);
      const mailOptions = {
        from: this.mailFrom,
        to: userEmail,
        subject: title,
        html: `<!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                    <title>{{title}}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
                    <style>
                        @media screen {
                            * {
                                align-items: center;
                                margin: auto;
                                text-align: center;
                                font-family: "Roboto", sans-serif;
                                font-weight: 400;
                            }
                            body {
                                font-family: "Roboto", sans-serif;
                            }
                            .body {
                                width: 100%;
                                max-width: 100%;
                                background-color: #F4F6FC;
                            }
                            .header {
                                background: url() no-repeat;
                                margin: auto;
                                color: white;
                            }
                            .greetings {
                                color: #00338D;
                                font-weight: 900;
                            }
                            .greetings2 {
                                color: #00A3A1;
                                font-weight: 900;
                            }
                            .marginBottom{
                                margin-bottom: 40px;
                            }
                            .container {
                                width: 80%;
                                background-color: #ffffff;
                                font-family: "Roboto", sans-serif;
                                color: #030711;
                                padding-top: 30px;
                                margin-top: 30px;
                                margin-bottom: 30px;
                            }
                            .my-auto {
                                margin: 50px auto;
                            }
                            .py-auto {
                                padding-top: 200px;
                                padding-bottom: 90px;
                            }
                            .footer {
                                background-image: linear-gradient(#02338D, #03499F);
                                color: white;
                            }
                            .button {
                                background-color: #020B50;
                                -webkit-border-radius: 14px;
                                -moz-border-radius: 14px;
                                border-radius: 14px;
                                display: inline-block;
                                cursor: pointer;
                                color: #ffffff !important;
                                font-family: 'Roboto';
                                font-size: 18px;
                                font-weight: bold;
                                padding: 10px 76px;
                                margin: 30px auto;
                                text-decoration: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="body">
                        <div class="header">
                            <img src="${this.baseUrlApiApp}imgEmail/header.png" alt="" style="width: 100%;">
                        </div>
                        <div class="container">
                            <div class="my-auto">
                                <h2 class="greetings marginBottom">
                                    ¡Hola,  ${fullName} !
                                </h2>
                                <h1 class="greetings">
                                    ${message} 
                                </h1>
                                <h2 class="greetings2 marginBottom">
                                    ${officeType} 
                                </h2>
                                <h2 class="greetings">
                                    ${office} 
                                </h2>
                                <h3 class="greetings2">
                                    ${building}-${floor} 
                                </h3>
                                <h3 class="greetings">
                                    ${time}
                                </h3>
                                <h3 class="greetings">
                                    reserva #${numberReservation}
                                </h3>
                                <br>
                            </div>
                            <div class="footer">
                                <small>© ${anio} KPMG - Todos los derechos reservados.</small>
                            </div>
                        </div>
                    </div>
                </body>
                </html>`
      };
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
    });
  }
}
