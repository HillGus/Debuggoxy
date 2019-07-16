import * as express from 'express';
import * as http from 'http';
import { sendFile, redirectRequest } from './http-functions';
import bodyParser = require('body-parser');

export const initialize = (globalData: {sockets?: any[], httpServer?: http.Server}) => {

  const app: express.Express = express();
  app.use((req, res, next) => {

    req.body = '';
    req.setEncoding('utf-8');
    req.on('data', chunk => req.body += chunk);
    req.on('end', () => {

      try {
        req.body = JSON.parse(req.body);
      } catch (e) {}
    });
    next();
  });
  app.all("/*", (request, response) => {

    if (request.url === '/') {
      
      sendFile(response, 'dist/client/index.html');
    } else if (!request.url.match(/^\/.*(\.)[^/]*$/)) {

      redirectRequest({ 
        request, 
        response,
        sockets: globalData.sockets
      });
    } else {

      sendFile(response, 'dist/client' + request.url);
    }
  });

  return app;
}