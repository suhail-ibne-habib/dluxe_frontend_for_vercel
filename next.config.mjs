/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const isValidUrl = apiUrl && (apiUrl.startsWith('http://') || apiUrl.startsWith('https://') || apiUrl.startsWith('/'));
    const destination = `${isValidUrl ? apiUrl : 'http://localhost:5000'}/api/:path*`;

    return [
      {
        source: '/api/:path*',
        destination: destination
      },
    ];
  },
};

export default nextConfig;
