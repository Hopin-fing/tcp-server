import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
// import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	// @MessagePattern('sum')
	// async sumNumbers(data: Array<number>) {
	// 	logger.log('math microservice recieved a request to sum ' + data.toString());
	// 	return { result: data.reduce((a, b) => a + b) };
	// }
	// @MessagePattern({ cmd: 'sum' })
	// async sumNumbers() {
	// 	console.log('math microservice recieved a request to sum ');
	// 	return { result: 1 };
	// }

	@MessagePattern({ cmd: 'sum' })
	async accumulate(values: number[]): Promise<number> {
		console.log('Receive message from publisher!');
		return (values ?? []).reduce((acc, curr) => acc + curr);
	}

	// @MessagePattern({ cmd: 'sum' })
	// async accumulate(data: number[]): Promise<number> {
	// 	return (data || []).reduce((a, b) => a + b);
	// }
	// @EventPattern('user_created')
	// async handleUserCreated() {
	// 	console.log('test');
	// 	return 'test';
	// }
}
