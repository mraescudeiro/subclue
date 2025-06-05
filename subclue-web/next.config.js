// next.config.js  ─ em subclue-web ou na raiz, dependendo de onde você dá “npm run dev”

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Using remotePatterns avoids warnings about the deprecated "images.domains"
    // property and allows more specific configuration.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // qualquer pasta/arquivo
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
