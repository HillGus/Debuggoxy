import * as http from 'http';
import * as websocket from 'websocket';
import { logTransactions, getSettings } from './socket-communication';

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

      if (message.type !== 'utf8')
        return;

      try {
        message = JSON.parse(message.utf8Data);
      } catch (e) {
        return;
      }

      if (message && message.type == 'settings') {

        if (!message.data) {

          const resposta = JSON.stringify({
            type: 'settings',
            data: getSettings()
          });
          connection.send(resposta);
        }
      }
    });
  });
};