import { readFile } from 'fs';
import * as http from 'http';
import { Request, Response } from 'express';
import { logTransactions } from '../socket/socket-communication';

export const sendFile = (response, filePath) => {

  readFile(filePath, 'utf-8', async (err, fileContents) => {

    const status = err ? 404 : 200;
    const content = err ? 'Could not find file' : fileContents;

    response.status = status;
    response.write(content);
    response.end();
  });
}

export const redirectRequest = ({ request, response, sockets }: { request: Request, response: Response, sockets: any[] }) => {

  const options: http.RequestOptions = {
    host: 'localhost',
    port: 4400,
    method: request.method,
    path: request.url,
    headers: request.headers
  };

  const proxyRequest = http.request(options, proxyResponse => {
  
    response.writeHead(proxyResponse.statusCode,proxyResponse.headers);
    proxyResponse.pipe(response);

    if (sockets && sockets.length > 0) {

      logTransactions({
        request: request,
        response: proxyResponse,
        sockets: sockets
      });
    }
  });

  proxyRequest.on('error', error => {

    response.write('Exception occured while trying to redirect request: ' + error);
    response.statusCode = 500;
    response.end();
  });

  request.pipe(proxyRequest);
};