import { Type } from '@nestjs/common';
import { isString, isUndefined } from '@nestjs/common/utils/shared.utils';
import * as net from 'net';
import { Server as NetSocket, Socket } from 'net';
import {
	CLOSE_EVENT,
	DATA_EVENT,
	EADDRINUSE,
	ECONNREFUSED,
	ERROR_EVENT,
	MESSAGE_EVENT,
	NO_MESSAGE_HANDLER,
	TCP_DEFAULT_HOST,
	TCP_DEFAULT_PORT,
} from './constants';
import { createServer as tlsCreateServer } from 'tls';
import {
	CustomTransportStrategy,
	IncomingRequest,
	JsonSocket,
	PacketId,
	ReadPacket,
	Server,
	TcpContext,
	TcpOptions,
	TcpSocket,
	WritePacket,
} from '@nestjs/microservices';

export class CustomServerTCP extends Server implements CustomTransportStrategy {
	protected server: NetSocket;

	private readonly port: number;
	private readonly host: string;
	private readonly socketClass: Type<TcpSocket>;
	private isExplicitlyTerminated = false;
	private retryAttemptsCount = 0;
	private tlsOptions?;

	constructor(private readonly options: TcpOptions['options']) {
		super();
		this.port = this.getOptionsProp(options, 'port') || TCP_DEFAULT_PORT;
		this.host = this.getOptionsProp(options, 'host') || TCP_DEFAULT_HOST;
		this.socketClass = this.getOptionsProp(options, 'socketClass') || JsonSocket;
		this.tlsOptions = this.getOptionsProp(options, 'tlsOptions');

		this.init();
		this.initializeSerializer(options);
		this.initializeDeserializer(options);
	}

	public listen(callback: (err?: unknown, ...optionalParams: unknown[]) => void) {
		this.server.once(ERROR_EVENT, (err: Record<string, unknown>) => {
			if (err?.code === EADDRINUSE || err?.code === ECONNREFUSED) {
				return callback(err);
			}
		});
		this.server.listen(this.port, this.host, callback as () => void);
	}

	public close() {
		this.isExplicitlyTerminated = true;

		this.server.close();
	}

	public bindHandler(socket: Socket) {
		const readSocket = this.getSocketInstance(socket);
		readSocket.on(DATA_EVENT, async (msg: any) => {
			this.handleData(readSocket, msg);
		});
		readSocket.on(MESSAGE_EVENT, async (msg: ReadPacket & PacketId) => {
			this.handleMessage(readSocket, msg);
		});
		readSocket.on(ERROR_EVENT, this.handleError.bind(this));
	}

	public async handleData(socket: TcpSocket, data: unknown) {
		const currentData = JSON.parse(data.toString());
		const packet = { pattern: '', data: currentData['data'] };
		const pattern = '';

		const tcpContext = new TcpContext([socket, pattern]);
		if (isUndefined((packet as IncomingRequest).id)) {
			return this.handleEvent(pattern, packet, tcpContext);
		}
		const handler = this.getHandlerByPattern(pattern);
		if (!handler) {
			const status = 'error';
			const noHandlerPacket = this.serializer.serialize({
				id: (packet as IncomingRequest).id,
				status,
				err: NO_MESSAGE_HANDLER,
			});
			return socket.sendMessage(noHandlerPacket);
		}
		const response$ = this.transformToObservable(await handler(packet.data, tcpContext));

		response$ &&
			this.send(response$, data => {
				Object.assign(data, { id: (packet as IncomingRequest).id });
				const outgoingResponse = this.serializer.serialize(data as WritePacket & PacketId);
				socket.sendMessage(outgoingResponse);
			});
	}

	public async handleMessage(socket: TcpSocket, rawMessage: unknown) {
		const packet = await this.deserializer.deserialize(rawMessage);
		const pattern = !isString(packet.pattern) ? JSON.stringify(packet.pattern) : packet.pattern;
		const tcpContext = new TcpContext([socket, pattern]);
		if (isUndefined((packet as IncomingRequest).id)) {
			return this.handleEvent(pattern, packet, tcpContext);
		}
		const handler = this.getHandlerByPattern(pattern);
		if (!handler) {
			const status = 'error';
			const noHandlerPacket = this.serializer.serialize({
				id: (packet as IncomingRequest).id,
				status,
				err: NO_MESSAGE_HANDLER,
			});
			return socket.sendMessage(noHandlerPacket);
		}
		const response$ = this.transformToObservable(await handler(packet.data, tcpContext));

		response$ &&
			this.send(response$, data => {
				Object.assign(data, { id: (packet as IncomingRequest).id });
				const outgoingResponse = this.serializer.serialize(data as WritePacket & PacketId);
				socket.sendMessage(outgoingResponse);
			});
	}

	public handleClose(): undefined | number | NodeJS.Timer {
		if (
			this.isExplicitlyTerminated ||
			!this.getOptionsProp(this.options, 'retryAttempts') ||
			this.retryAttemptsCount >= this.getOptionsProp(this.options, 'retryAttempts')
		) {
			return undefined;
		}
		++this.retryAttemptsCount;
		return setTimeout(() => this.server.listen(this.port, this.host), this.getOptionsProp(this.options, 'retryDelay') || 0);
	}

	private init() {
		if (this.tlsOptions) {
			// TLS enabled, use tls server
			this.server = tlsCreateServer(this.tlsOptions, this.bindHandler.bind(this));
		} else {
			// TLS disabled, use net server
			this.server = net.createServer(this.bindHandler.bind(this));
		}
		this.server.on(ERROR_EVENT, this.handleError.bind(this));
		this.server.on(CLOSE_EVENT, this.handleClose.bind(this));
	}

	private getSocketInstance(socket: Socket): TcpSocket {
		return new this.socketClass(socket);
	}
}
