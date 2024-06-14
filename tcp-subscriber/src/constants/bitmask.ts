import { LogType } from './eventLogs';

export const logTypeDictionary: Record<LogType, number[]> = {
	[LogType.TamperingEvents]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
	[LogType.AccessControlEvents]: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
};

enum Status {
	SELF_DIAGNOSIS = 0,
	VOLTAGE_INTERRUPTION = 1, // 2^0
	NETWORK_QUALITY = 2, // 2^1
	EMAIL_VERIFIED = 4, // 2^2
	PAYMENT_VERIFIED = 8, // 2^3
	TFA_ENABLED = 16, // 2^4
}
