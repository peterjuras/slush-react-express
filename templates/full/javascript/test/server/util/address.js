module.exports = server => {
  const serverAddress = server.address();

  if (!serverAddress) {
    return undefined;
  }

  if (serverAddress.address.indexOf('::') !== -1 ||
    serverAddress.address.indexOf('0.0.0.0') !== -1) {
    serverAddress.address = 'localhost';
  }

  return `${serverAddress.address}:${serverAddress.port}`;
}
