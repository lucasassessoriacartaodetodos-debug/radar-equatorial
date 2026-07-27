/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@supabase/ssr", "@tanstack/react-table", "@tanstack/table-core"],
};

export default nextConfig;