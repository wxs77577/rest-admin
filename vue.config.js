module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  baseUrl: process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_BASE_URL
    : '/'
}