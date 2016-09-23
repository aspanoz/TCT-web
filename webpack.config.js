const webpack = require('webpack');
const path = require('path');
const stringifyLoaders = require('webpack-stringify-loaders');
const sugarss = require('sugarss');

var StyleLintPlugin = require('stylelint-webpack-plugin');

const isDebug = global.DEBUG === false ? false : !process.argv.includes('--release');

module.exports  = {
  devtool: 'cheap-module-eval-source-map',
  debug: isDebug,
  entry: [
    './src/main.js'
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: __dirname,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            "react",
            "es2015",
            "stage-1"
          ],
          plugins: [
            "react-hot-loader/babel",
            "babel-root-slash-import",
            "transform-runtime"
          ]
        }
      },
      {
        test: /\.sss/,
        loader: stringifyLoaders([
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              sourceMap: isDebug,
              modules: true,
              localIdentName: isDebug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            }
          },
          {
            loader: 'postcss-loader',
            query: 'parser=sugarss',
          }
        ])
      },
    ]
  },

  postcss(webpack) {
    return [
      require('postcss-easy-import')({ addDependencyTo: webpack }),
      require('postcss-nesting')(),
      require('autoprefixer')(),
    ];
  },

  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  devServer: {
    contentBase: './dist',
    hot: true
  },

  plugins: [
    new StyleLintPlugin({
      files: '**/*.sss',
      failOnError: false,
      quiet: false,
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
