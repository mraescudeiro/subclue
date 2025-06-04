// next.config.js  ─ em subclue-web ou na raiz, dependendo de onde você dá “npm run dev”

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 🍀 solução 1 — simples
    domains: [
      'res.cloudinary.com',          // Cloudinary
      'lh3.googleusercontent.com'    // Google avatars
    ],

    /*  🍀 solução 2 — alternativa (remotePatterns)
        Se preferir, comente o bloco "domains" e
        use isso — mais flexível para caminhos específicos.

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',             // qualquer pasta/arquivo
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    */
  },
};

module.exports = nextConfig;
