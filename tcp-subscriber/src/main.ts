import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CustomServerTCP } from './transporter/customTCPServer.transporter';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		strategy: new CustomServerTCP({
			port: 3000,
		}),
	});

	await app.listen();
}
bootstrap();
