const listenToTransactions = () => {

  socketService.onMessage((message) => {

    if (message && message.type === 'transaction') {

      createTransactionsLog(message.data);
    }
  });
}

const createTransactionsLog = (transactions) => {

  const request = transactions.request;
  const response = transactions.response;

  const color = {
    GET: 'indigo',
    POST: 'deep-purple',
    PUT: 'cyan',
    PATCH: 'deep-orange',
    DELETE: 'red',
    CONNECT: 'yellow',
    OPTIONS: 'teal',
    TRACE: 'pink'
  }[request.method] || 'brown';

  const collapse = $('<div class="collapse"></div>');
  const collapseHead = $(`<div class="collapse-head btn ${color}-400"></div>`);
  collapseHead.append($(`<p class="title">${request.method} - ${request.url}</p>`));
  
  const collapseBody = $(`<div class="transaction-log collapse-body ${color}-300"></div>`);
  collapseBody.append(createTransactionInfo(request, 'Request'));
  collapseBody.append(createTransactionInfo(response, 'Response'));
  $(collapseBody).css('display', 'none');

  $(collapseHead).click(() => {

    $(collapseBody).css('display', $(collapseBody).css('display') == 'none' ? '' : 'none');
  });

  collapse.append(collapseHead);
  collapse.append(collapseBody);

  return collapse;
};

const createTransactionInfo = (transaction, transactionName: string) => {

  const transactionInfo = $(`<div class="${transactionName.toLowerCase()}-info"></div>`);
    
  transactionInfo.append($(`<p class="sub-title">${transactionName}</p>`));

    if (transaction.headers) {
      const transactionHeaderInfo = $(`<div class="headers-info"></div>`);
      transactionHeaderInfo.append($('<p class="topic">Headers</p>'));
      transactionHeaderInfo.append($(`<pre class="data">${parseData(transaction.headers)}</pre>`));
      transactionInfo.append(transactionHeaderInfo);
    }

    if (transaction.body) {
      const transactionBodyInfo = $(`<div class="body-info"></div>`);
      transactionBodyInfo.append($('<p class="topic">Body</p>'));
      transactionBodyInfo.append($(`<pre class="data">${parseData(transaction.body)}</pre>`));
      transactionInfo.append(transactionBodyInfo);
    }

  return transactionInfo;
};

const parseData = (data) => {

  if (typeof data !== 'object')
    return data;

  if ($.isArray(data))
    return JSON.stringify(data);

  let parsedData = '{';
  Object.keys(data).forEach(key => {

    parsedData += `\n  "${key}": ${JSON.stringify(data[key])},`;
  });
  return parsedData.substr(0, parsedData.length - 1) + '\n}';
};