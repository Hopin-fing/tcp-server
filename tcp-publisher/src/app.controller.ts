import { Controller, Get, Post, Inject, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
	constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

	// @Get()
	// getStart(): void {
	// 	console.log('test');
	// 	this.client.send({ cmd: 'sum' }, {});
	// }

	@Post()
	getStart(@Body() body: number[]): Observable<number> {
		console.log('test');
		return this.client.send<number>({ cmd: 'sum' }, body);
	}
}
