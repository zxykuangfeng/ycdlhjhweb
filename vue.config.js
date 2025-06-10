'use strict';
const path = require('path');
const defaultSettings = require('./src/settings.js');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || '盐城市道路户籍化管理系统';
const port = process.env.port || process.env.npm_config_port || 9527;

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,

  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/admin': {
        target: 'http://roadserver.lysoo.com',
        changeOrigin: true
      }
    }
  },

  configureWebpack: config => {
    config.name = name;
    config.resolve = {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    };
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        minimize: false // ✅ 禁用所有压缩，避免 cssnano 报错
      };
    }
  },

  chainWebpack(config) {
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      });

    config.when(process.env.NODE_ENV === 'development', config =>
      config.devtool('cheap-source-map')
    );

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          inline: /runtime\..*\.js$/
        }]);

      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3,
            reuseExistingChunk: true
          }
        }
      });

      config.optimization.runtimeChunk('single');
    });
  }
};
