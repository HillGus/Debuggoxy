import * as http from 'http';
import * as appServer from './app/app-server';
import * as socketServer from './socket/socket-server';

let globalData: {sockets?: any[], httpServer?: http.Server} = {};

const httpServer = http.createServer(appServer.initialize(globalData));
httpServer.listen(4300);

globalData.httpServer = httpServer;

socketServer.initialize(globalData);