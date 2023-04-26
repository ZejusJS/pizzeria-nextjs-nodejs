/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self' https://*.gstatic.com https://recaptcha.net https://*.googleapis.com https://*.cloudinary.com https://*.unsplash.com https://pizzeria-backend-4vij.onrender.com;
  script-src 'self' 'unsafe-eval' https://recaptcha.net https://*.gstatic.com https://pizzeria-backend-4vij.onrender.com;
  child-src 'self' https://pizzeria-backend-4vij.onrender.com;
  style-src 'self' 'unsafe-hashes' 'unsafe-inline' https://*.googleapis.com https://pizzeria-backend-4vij.onrender.com;
  img-src 'self' blob: https://*.cloudinary.com https://*.unsplash.com https://pizzeria-backend-4vij.onrender.com;
  frame-src 'self' https://recaptcha.net https://pizzeria-backend-4vij.onrender.com;
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
  // reactStrictMode: true,
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
        source: '/api2/:path*',
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
