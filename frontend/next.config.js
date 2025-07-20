// frontend/next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",               // frontend listens on /api/*
        destination: "http://localhost:3002/api/:path*",  // proxies to your backend
      },
    ]
  },
}
