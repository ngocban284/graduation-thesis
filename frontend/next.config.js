module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)?", // Matches all pages
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.dextools.io *.coingecko.com/ *.syncbond.com https://www.amcharts.com/lib/ static.cloudflareinsights.com www.google-analytics.com challenges.cloudflare.com; worker-src 'self' 'unsafe-eval' *.dextools.io blob:;",
          },
        ],
      },
    ];
  },
  //   webpack: (config, { isServer }) => {
  //     // Fixes npm packages that depend on `fs` module
  //     if (!isServer) {
  //       config.node = {
  //         fs: "empty",
  //       };
  //     }

  //     return config;
  //   },
};

module.exports = {
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };

    return config;
  },
};
