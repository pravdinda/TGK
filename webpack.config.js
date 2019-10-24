const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse');

require('dotenv').config();

module.exports = (env, argv) => {
  const DEBUG = argv.mode !== 'production';
  const outputFile = DEBUG ? '[name].js' : '[name].[chunkhash].js';

  const babel = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: DEBUG,

      babelrc: false,
      configFile: false,

      presets: [
        // A Babel preset that can automatically determine the Babel plugins and polyfills
        // https://github.com/babel/babel-preset-env
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: ['Chrome >= 65', 'ie >= 9'],
            },
            modules: false,
            useBuiltIns: false,
            debug: false,
          },
        ],
        // JSX
        // https://github.com/babel/babel/tree/master/packages/babel-preset-react
        ['@babel/preset-react', { development: DEBUG }],
        '@babel/preset-flow',
      ],
      plugins: [
        // Experimental ECMAScript proposals
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-arrow-functions'
      ],
    },
  };

  const config = {
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
      filename: outputFile,
    },
    devServer: {
      contentBase: path.join(__dirname, 'src/'),
      historyApiFallback: true,
      clientLogLevel: 'error',
      overlay: true,
      compress: true,
      hot: true,
      port: process.env.PORT || 8080,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"${DEBUG ? 'development' : 'production'}"`,
        'process.env.API_URL': `"${process.env.API_URL ||
          'https://api-lk.tgc-2.ru/api'}"`,
        'process.env.WS_ENDPOINT': `"${process.env.WS_ENDPOINT ||
          'wss://backend.tgk.ru'}"`,
        // Whether it's browser or not
        'process.env.BROWSER': `true`,
        __DEV__: `${DEBUG}`,
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: './index.html',
        inject: true,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new LoadablePlugin({ filename: 'stats.json', writeToDisk: true }),

      ...(DEBUG
        ? []
        : [
          // Webpack Bundle Analyzer
          // https://github.com/th0r/webpack-bundle-analyzer
          ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
        ]),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loaders: [babel],
        },
        {
          test: /\.(js|m?jsx?)$/,
          exclude: /node_modules/,
          loaders: [babel],
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          loader: babel,
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            'isomorphic-style-loader',
            {
              loader: 'css-loader',
              options: {
                // CSS Loader https://github.com/webpack/css-loader
                importLoaders: 1,
                sourceMap: DEBUG,
                // CSS Modules https://github.com/css-modules/css-modules
                modules: true,
                // CSS Nano http://cssnano.co/
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            'isomorphic-style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: DEBUG,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loaders: [babel, {
            loader: 'react-svg-loader',
            options: {
              svgo: {
                plugins: [{
                  removeTitle: false,
                }, {
                  removeViewBox: false,
                }],
                floatPrecision: 2,
              },
            },
          }]

        },
        {
          test: /\.(woff(2)?|ttf|eot|png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {},
            },
          ],
        }
      ],
    },
    resolve: {
      extensions: ['.', '.jsx', '.js', '.css', '.mjs'],
      modules: ['node_modules', path.resolve(__dirname, './src')],
    },
  };

  if (DEBUG) {
    config.mode = 'development';

    config.devtool = '#inline-source-map';
    config.watchOptions = {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
    };
    config.devServer = {
      contentBase: path.join(__dirname, 'dist'),
      inline: true,
      hot: true,
      publicPath: '/',
      filename: outputFile,
      port: 9000,
      historyApiFallback: true,
    };
  } else {
    console.log('Emitting production config');

    config.mode = 'production';

    const ManifestPlugin = require('webpack-manifest-plugin');
    config.plugins.push(new ManifestPlugin());
  }

  return config;
};
