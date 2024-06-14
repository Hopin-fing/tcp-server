export enum LogType {
	TamperingEvents = 3,
	AccessControlEvents = 4,
}

export const logTypeDictionary: Record<LogType, string> = {
	[LogType.TamperingEvents]: 'Журнал внешних воздействий',
	[LogType.AccessControlEvents]: 'Журнал контроль доступа',
};
