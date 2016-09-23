const webpack = require('webpack');
const path = require('path');
const stringifyLoaders = require('webpack-stringify-loaders');

// PostCSS
const sugarss = require('sugarss');
const postcssEasyImport = require('postcss-easy-import');
const postcssNesting = require('postcss-nesting');
const autoprefixer = require('autoprefixer');

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
            loader: 'postcss-loader'
          }
        ])
      },
    ]
  },

  postcss(webpack) {
    return {
      plugins: [
        postcssEasyImport({ addDependencyTo: webpack }),
        postcssNesting,
        autoprefixer
      ],
      parser: sugarss
    };
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
