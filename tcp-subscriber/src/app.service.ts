import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as fs from 'fs';
import { getAppRootDir } from './helpers/getRootDir';
import { CellStatus, IPFormat } from './enum/app.enum';
import { ICheckLog } from './interface/app.interface';

@Injectable()
export class AppService {
	checkBitmask(bitmask: number, ip: string): void {
		const currentIPData = this.checkIP(ip);
		this.createLog(bitmask, currentIPData);

		if (currentIPData.format === IPFormat.Error) return;

		const binBitmask = bitmask.toString(2);
		const bitmaskArr = Array.from(binBitmask.toString(), Number);
		const eventArr = [];
		const bitmaskLen = bitmaskArr.length;

		bitmaskArr.map((el, index) => {
			const currentCellIndex = bitmaskLen - index - 1;
			if (el) eventArr.push(CellStatus[currentCellIndex]);
		});
	}

	createLog(bitmask: number, ip: ICheckLog): void {
		const currentDate = moment().format('DD_MM_YYYY');
		const currentTime = moment().format('HH:mm:ss');
		const currentPath = `${getAppRootDir()}/logs/${currentDate}.log`;

		if (!fs.existsSync(currentPath)) {
			fs.appendFile(currentPath, `Get new mask - ${bitmask};  ip - ${ip['ip']}; time - ${currentTime}`, function (err) {
				if (err) throw err;
			});
			return;
		}

		this.writeNewNote(bitmask, ip['ip'], currentTime, currentPath);
	}

	writeNewNote(bitmask: number, ip: string, currentTime: string, currentPath: string): void {
		fs.appendFile(currentPath, `\nGet new mask - ${bitmask};  ip - ${ip}; time - ${currentTime}`, function (err) {
			if (err) throw err;
		});
	}

	checkIP(ip: string): ICheckLog {
		const IPv4reg = /^(?<!\d)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?!\d)/gm;
		const IPv6reg =
			/(^|\s|(\[))(::)?([a-f\d]{1,4}::?)(?<!\d)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?!\d)/gm;

		if (IPv4reg.test(ip)) {
			console.log('testReg4');

			return { ip: ip.match(IPv4reg)[0], format: IPFormat.IPv4 };
		}
		if (IPv6reg.test(ip)) {
			console.log('testReg6');
			return { ip: ip.match(IPv6reg)[0], format: IPFormat.IPv6 };
		}
		return { ip, format: IPFormat.Error };
	}
}
