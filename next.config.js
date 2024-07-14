/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	images: {
		minimumCacheTTL: 60 * 60 * 48,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.akamai.steamstatic.com',
				port: ''
			}
		]
	},
	experimental: {
		staleTimes: {
			dynamic: 0
		}
	}
};

module.exports = nextConfig;
