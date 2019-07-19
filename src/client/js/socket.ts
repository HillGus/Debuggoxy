const SocketService = function() {

  const socket = new WebSocket('ws://localhost:4300', 'yxoggubed');
  let messageListeners: Array<(message: any) => void> = [];
  const openingListeners: Array<(() => void)> = [];

  socket.onerror = error => console.log('Error on socket:', error);
  socket.onopen = () => {

    openingListeners.forEach(listener => listener());
  }
  socket.onmessage = messageEvent => {

    let message;
    try {
      message = JSON.parse(messageEvent.data);
    } catch (e) {
      message = messageEvent.data;
    }
    messageListeners.forEach(listener => listener(message));
  }

  this.addMessageListener = (listener: (message: any) => void) => {

    messageListeners.push(listener);
  };

  this.removeMessageListener = (listener: (message: any) => void) => {

    messageListeners = messageListeners.filter(mListener => mListener !== listener);
  };

  this.sendMessage = (message: string) => {

    if (typeof message === 'string')
      socket.send(message);
    else
      socket.send(JSON.stringify(message));
  };

  this.addOpeningListener = (listener: () => void) => {

    openingListeners.push(listener);
  }
}