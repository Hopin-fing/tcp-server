import { CallHandler, Controller, ExecutionContext, Logger, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, TcpContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Request } from 'express';
// import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	// @MessagePattern({ cmd: 'sum' })
	// async accumulate(values: number[]): Promise<number> {
	// 	console.log('Message from publisher!');
	// 	return (values ?? []).reduce((acc, curr) => acc + curr);
	// }

	// @MessagePattern({ cmd: 'sum' })
	// async accumulate(data: number[]): Promise<number> {
	// 	return (data || []).reduce((a, b) => a + b);
	// }

	@EventPattern('')
	async getIp(@Payload() data: number, @Ctx() context: TcpContext): Promise<any> {
		const client = context.getSocketRef();
		const clientIp = client.socket.remoteAddress;
		this.appService.checkBitmask(data, clientIp);
		// return clientIp;
	}
}
