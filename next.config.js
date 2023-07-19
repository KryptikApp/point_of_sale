/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: "build",
  // output: "export",
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */

// const DFXWebPackConfig = require("./dfx.webpack.config");
// DFXWebPackConfig.initCanisterIds();

// const webpack = require("webpack");

// // Make DFX_NETWORK available to Web Browser with default "local" if DFX_NETWORK is undefined
// const EnvPlugin = new webpack.EnvironmentPlugin({
//   DFX_NETWORK: "local",
// });

// const nextConfig = {
//   reactStrictMode: true,
//   distDir: "build",
// };

// module.exports = {
//   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//     // Plugin
//     config.plugins.push(EnvPlugin);

//     // Important: return the modified config
//     return config;
//   },
//   ...nextConfig,
//   output: "export",
//   images: {
//     unoptimized: true,
//   },
// };
