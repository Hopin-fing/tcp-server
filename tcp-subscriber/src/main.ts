import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomServerTCP } from './transporters/customTCPServer.transporter';
import { OutboundResponseIdentitySerializer } from './constants/serializer/outbound-response-identity.serializer';
import { InboundMessageIdentityDeserializer } from './constants/deserializers/inbound-message-identity.deserializer';

async function bootstrap() {
	// const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
	// 	transport: Transport.TCP,
	// });

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		strategy: new CustomServerTCP({
			port: 3000,
		}),
		// options: {
		// 	port: 3000,
		// },
	});

	await app.listen();
}
bootstrap();
