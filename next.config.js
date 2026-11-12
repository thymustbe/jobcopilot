/** @type {import('next').NextConfig} */
const isGithubActions = Boolean(process.env.GITHUB_ACTIONS);
let basePath = '';
let assetPrefix = '';

if (isGithubActions) {
  // Trim repo name from GITHUB_REPOSITORY (e.g. "thymustbe/jobcopilot" -> "/jobcopilot")
  const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '') || 'jobcopilot';
  basePath = `/${repo}`;
  assetPrefix = `/${repo}/`;
}

// Allow explicit override (e.g. if a custom domain is configured)
if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined && process.env.NEXT_PUBLIC_BASE_PATH !== '') {
  basePath = process.env.NEXT_PUBLIC_BASE_PATH;
  assetPrefix = `${basePath}/`;
}

const nextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: assetPrefix,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
