import { LogType } from './eventLogs';

export const logTypeDictionary: Record<LogType, number[]> = {
	[LogType.TamperingEvents]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	[LogType.AccessControlEvents]: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
};
