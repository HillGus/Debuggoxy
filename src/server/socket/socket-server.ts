import * as http from 'http';
import * as websocket from 'websocket';


export const initialize = (globalData: {sockets?: any[], httpServer?: http.Server}) => {

  const socketServer = new websocket.server();

  socketServer.mount({
    httpServer: globalData.httpServer
  });

  socketServer.on('request', request => {

    if (request.requestedProtocols.includes('yxoggubed')) {
      request.accept('yxoggubed');
    } else {
      request.reject(401, 'Protocols not allowed.');
    }
  });

  socketServer.on('connect', connection => {

    if (globalData.sockets)
      globalData.sockets.push(connection);
    else
      globalData.sockets = [connection];

    connection.on('message', message => {

      console.log('Message from client:', message);
      connection.send('Hello client!');
    });
  });
};