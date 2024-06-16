import { Injectable } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class TcpService {
	constructor() {}

	upSocket() {
		const server = net.createServer(function (socket) {
			socket.write('Echo server\r\n');
			socket.pipe(socket);
		});

		server.listen(3002, '127.0.0.1');
	}
}
