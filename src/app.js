import express from 'express';
import routes from './routes';
import session from 'express-session'

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(session({secret: 'segredo', saveUninitialized: true, resave: true}));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
