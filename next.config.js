/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    target: 'serverless',
    async rewrites() {
        return [
            {
                source: '/:any*',
                destination: '/',
            },
        ]
    },
}
