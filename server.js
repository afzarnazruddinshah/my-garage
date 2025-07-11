const app = require('./app');
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

server.keepAliveTimeout = 61 * 1000;
server.headersTimeout = 16 * 1000;