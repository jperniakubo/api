import Http from 'http';
import Https from 'https';
import * as fs from 'fs';

import express from 'express';

import config from '../config';

import {ExpressApp} from './ExpressApp';
import {SequelizeApp} from './SequelizeApp';
import {ApiDocApp} from './ApiDocApp';
import {SentryApp} from './SentryApp';

export class Server {
  expressApp = new ExpressApp();
  httpServer: Http.Server;
  httpsServer: Https.Server;
  sequelizeApp = new SequelizeApp();
  sentryApp = new SentryApp();
  apiDocApp: ApiDocApp;

  runServer = (): Promise<void | Http.Server> => {
    this.sentryApp.init();

    // eslint-disable-next-line no-process-env
    console.log('Environment:', process.env.ENV);
    // eslint-disable-next-line no-process-env
    if (process.env.SSLON === 'TRUE') {
      return this.sequelizeApp
        .databaseConnection()
        .then(this.serverListenHttps)
        .catch(this.serverErrorHandler);
    } else {
      return this.sequelizeApp
        .databaseConnection()
        .then(this.serverListenHttp)
        .catch(this.serverErrorHandler);
    }
  };

  serverListenHttp = (): Http.Server => {
    const {PORT: port, HOST: host} = config;
    // eslint-disable-next-line no-console
    console.info('Start Server', `Server listener: http://${host}:${port}/`);
    return this.httpServer.listen(port, (): void => {});
  };

  serverListenHttps = (): Https.Server => {
    const {PORT: port, HOST: host} = config;
    const options = {
      key: fs.readFileSync(`/home/node_tugo/tugossl.key`),
      cert: fs.readFileSync(`/home/node_tugo/STAR_tugoapp_com.chained.crt`)
    };
    // @ts-ignore
    this.httpsServer = new Https.Server(options, this.expressApp.app);
    // eslint-disable-next-line no-console
    console.info('Start Server', `Server listener: https://${host}:${port}/`);
    return this.httpsServer.listen(port, (): void => {});
  };

  serverErrorHandler = (error: Error): void => {
    // eslint-disable-next-line no-console
    console.error('Server run error: ', error.message);
  };

  constructor() {
    const expressApp = this.expressApp;
    this.httpServer = new Http.Server(expressApp.app);
    this.apiDocApp = new ApiDocApp(expressApp.app, expressApp.getAppRouter());
  }
}
