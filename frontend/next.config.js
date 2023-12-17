module.exports = {
    async headers() {
        return [
            {
                source: '/(.*)?', // Matches all pages
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.dextools.io *.coingecko.com/ *.syncbond.com https://www.amcharts.com/lib/ static.cloudflareinsights.com www.google-analytics.com challenges.cloudflare.com; worker-src 'self' 'unsafe-eval' *.dextools.io blob:;",
                    }
                ]
            }
        ]
    }
}