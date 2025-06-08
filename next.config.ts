import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb', // Increase from default 1mb
        },
    },
}

export default nextConfig
