/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src 'self';
  style-src 'self' 'unsafe-hashes' 'unsafe-inline';
  font-src 'self' https://*.googleapis.com https://*.gstatic.com;  
  img-src 'self' https://*.cloudinary.com https://*.unsplash.com;
  frame-src 'self';
`

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
]

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
        destination: 'https://pizzeria-backend-4vij.onrender.com/:path*' // Proxy to Backend
        // destination: 'http://localhost:8000/:path*' // Proxy to Backend 
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
