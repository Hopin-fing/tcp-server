import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { TcpModule } from './module/tcp/tcp.module';
// import * as net from 'net';

@Module({
	imports: [TcpModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

// {
// 	provide: 'TcpServerService',
// 	useFactory: () => {
// 		const server = net.createServer(socket => {
// 			socket.write('\r\rFrom NestJs TcpServerService\r\n');
// 			socket.pipe(socket);
// 		});

// 		server.listen(1337, '127.0.0.1');

// 		return server;
// 	},
// },
// ,
