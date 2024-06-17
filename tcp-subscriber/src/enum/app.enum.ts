export enum IPFormat {
	IPv6 = 'IPv6',
	IPv4 = 'IPv4',
	Error = 'wrong format!',
}
export enum CellStatus {
	SELF_DIAGNOSIS,
	VOLTAGE_INTERRUPTION, // 2^0
	NETWORK_QUALITY,
}
