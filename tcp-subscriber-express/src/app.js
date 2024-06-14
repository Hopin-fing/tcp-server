// Include Nodejs' net module.
const Net = require('net');
// Create TCP server
const server = Net.createServer((socket) => {
  console.log('Client connected');

  // Event when receiving data from the client
  socket.on('data', (data) => {
    console.log('Data received:', data.toString());
    console.log('remoteAddress received:', socket.remoteAddress);

    // Send data back to the client
    socket.write('Data received by the server: ' + data.toString());
  });

  // Event when the client connection is closed
  socket.on('close', () => {
    console.log('Client disconnected');
  });

  // Handle connection errors
  socket.on('error', (err) => {
    console.error('Connection error:', err);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`TCP server started on port ${port}`);
});