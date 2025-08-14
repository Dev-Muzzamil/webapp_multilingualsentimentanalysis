function initSocket(server) {
  const io = require('socket.io')(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    // Listen & Emit events
  });
  return io;
}
module.exports = { initSocket };