let socketService;

$(document).ready(() => {

  socketService = new SocketService();
  socketService.addOpeningListener(() => {

    listenToTransactions();
    initializeSettings();
  });
});

