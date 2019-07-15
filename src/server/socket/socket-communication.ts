import { Request } from 'express';
import { IncomingMessage } from 'http';

export const logTransactions = ({ request, response, sockets }: { request: Request, response: IncomingMessage, sockets: any[] }) => {

  let responseBody = '';
  
  response.on('data', data => {
    responseBody += data;
  });

  response.on('end', () => {

    const socketMessage = JSON.stringify({
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body
      },
      response: {
        status: response.statusCode,
        message: response.statusMessage,
        headers: response.headers,
        body: responseBody
      }
    });

    sockets.forEach(socket => socket.send(socketMessage));
  });
}