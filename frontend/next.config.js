/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  // images: {
  //   dangerouslyAllowSVG: true,
  //   contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  // },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'https://pizzeria-backend-4vij.onrender.com/:path*' // Proxy to Backend
        destination: 'http://localhost:8000/:path*' // Proxy to Backend 
      }
    ]
  }
}

module.exports = nextConfig
