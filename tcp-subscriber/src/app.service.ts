import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as fs from 'fs';
import { getAppRootDir } from './helpers/getRootDir';

@Injectable()
export class AppService {
	checkBitmask(bitmask: number, ip: string): void {
		this.createLog(bitmask, ip);
		console.log('bitmask1', bitmask);
		console.log('bitmask2', bitmask.toString(2));
	}

	createLog(bitmask: number, ip: string): void {
		const currentDate = moment().format('DD_MM_YYYY');
		const currentTime = moment().format('HH:mm:ss');
		const currentPath = `${getAppRootDir()}/logs/${currentDate}.log`;

		if (!fs.existsSync(currentPath)) {
			fs.appendFile(currentPath, `Get new mask - ${bitmask};  ip - ${ip}; time - ${currentTime}`, function (err) {
				if (err) throw err;
			});
			return;
		}

		this.writeNewNote(bitmask, ip, currentTime, currentPath);
	}

	writeNewNote(bitmask: number, ip: string, currentTime: string, currentPath: string): void {
		fs.appendFile(currentPath, `\nGet new mask - ${bitmask};  ip - ${ip}; time - ${currentTime}`, function (err) {
			if (err) throw err;
		});
	}

	checkIP(ip: string): string {
		const IPv4reg = /(?<!\d)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?!\d)/gm;
		if (IPv4reg.test(ip)) return ip.match(IPv4reg)[0];
		this.createLog(0, ip + ' something wrong!');
	}
}
