// Include Nodejs' net module.
const Net = require('net');
// The port number and hostname of the server.
const port = 3000;
const host = 'localhost';

// Create a new TCP client.
const client = new Net.Socket();
// Send a connection request to the server.
client.connect({ port: port, host: host });

client.on('connect',function(){
   
    console.log('run!');
	const data = {data:8}
	const message = JSON.stringify(data);
	const req = message.length + '#' + message
	console.log("req ", req)
	console.log("message ", message)
	// client.write(req);
	client.write(message);
    
});

client.on('data', function(chunk) {
    console.log(`Data received from the server: ${chunk.toString()}.`);
    
    client.end();
});

client.on('end', function() {
    console.log('Requested an end to the TCP connection');
});