let socketService;

$(document).ready(() => {

  socketService = new SocketService();
  listenToTransactions();
  initializeSettings();
});

