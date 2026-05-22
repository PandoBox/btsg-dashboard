/** @type {import('next').NextConfig} */
const nextConfig = {
  // Recharts and other chart libs use browser-only APIs; ensure server renders don't break
  experimental: {},
};

export default nextConfig;
