import { Reader } from '@maxmind/geoip2-node';

interface Country {
	isoCode: string | undefined;
	countryName: string | undefined;
	cityName: string | undefined;
}

interface Asn {
	autonomousSystemNumber: number | undefined;
	autonomousSystemOrganization: string | undefined;
}

export interface Player {
	id: number;
	time: string;
	ping: number;
	loss: number;
	state: string;
	rate: number;
	adr: string;
	name: string;
	country: Country;
	asn: Asn;
}

export async function parsePlayerData(data: string) {
	const playerRegex =
		/(\d+)\s+((?:\d+:)?(?:\d+:)?\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(\d+)\s+(\d+\.\d+\.\d+\.\d+:\d+)\s+'(.+)'/;
	const players: Player[] = [];

	const lines = data.split('\n');
	for (const line of lines) {
		const match = line.match(playerRegex);
		if (match && match[8] !== 'unknown') {
			const { country, asn } = await getIpDetails(match[7].split(':')[0]);
			const player: Player = {
				id: parseInt(match[1], 10),
				time: match[2],
				ping: parseInt(match[3], 10),
				loss: parseInt(match[4], 10),
				state: match[5],
				rate: parseInt(match[6], 10),
				adr: match[7],
				name: match[8],
				country,
				asn
			};
			players.push(player);
		}
	}

	return players;
}

async function getIpDetails(ip: string) {
	if (!process.env.MAXMIND_LICENSE_KEY) {
		return {
			country: {
				isoCode: undefined,
				countryName: undefined,
				cityName: undefined
			},
			asn: {
				autonomousSystemNumber: undefined,
				autonomousSystemOrganization: undefined
			}
		};
	}
	const city = await Reader.open('./maxmind/GeoLite2-City.mmdb').then(
		(reader) => {
			try {
				const ipDetails = reader.city(ip);
				return ipDetails;
			} catch (e) {
				return undefined;
			}
		}
	);
	const asn = await Reader.open('./maxmind/GeoLite2-ASN.mmdb').then(
		(reader) => {
			try {
				const ipDetails = reader.asn(ip);
				return ipDetails;
			} catch (e) {
				return undefined;
			}
		}
	);
	return {
		country: {
			isoCode: city?.country?.isoCode || undefined,
			countryName: city?.country?.names?.en || undefined,
			cityName: city?.city?.names?.en || undefined
		} as Country,
		asn: {
			autonomousSystemNumber: asn?.autonomousSystemNumber || undefined,
			autonomousSystemOrganization:
				asn?.autonomousSystemOrganization || undefined
		} as Asn
	};
}
