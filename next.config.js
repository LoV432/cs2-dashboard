/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	images: {
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
