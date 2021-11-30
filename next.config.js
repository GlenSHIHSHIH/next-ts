/** @type {import('next').NextConfig} */

require('dotenv').config()
const webpack = require('webpack')

module.exports = {
  reactStrictMode: true,
  distDir:"/docker_build_react/compiler/build",
  webpack: (config) => {
    config.plugins.push(
      new webpack.EnvironmentPlugin(process.env)
    )
    return config
  }
}
