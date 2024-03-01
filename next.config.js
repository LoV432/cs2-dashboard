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
	}
};

module.exports = nextConfig;
