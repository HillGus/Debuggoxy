const SocketService = function() {

  const socket = new WebSocket('ws://localhost:4300', 'yxoggubed');
  const messageListeners: Array<(message: any) => void> = [];

  socket.onerror = error => console.log('Error on socket:', error);
  socket.onmessage = message => {

    messageListeners.forEach(listener => listener(message.data));
  }

  this.onMessage = (callback: (message: any) => void) => {

    messageListeners.push(callback);
  };

  this.sendMessage = (message: string|{[key:string]: any}) => {

    if (typeof message === 'string')
      socket.send(message);
    else
      socket.send(JSON.stringify(message));
  };
}