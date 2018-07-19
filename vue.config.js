module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  baseUrl: process.env.PRODUCTION_BASE_URL,
  configureWebpack: {
    // No need for splitting
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },
  
}