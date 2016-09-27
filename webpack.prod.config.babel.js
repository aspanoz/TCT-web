import path from 'path';
import webpack from 'webpack';

import stringifyLoaders from 'webpack-stringify-loaders';

// PostCSS
import postcssEasyImport from 'postcss-easy-import';
import postcssNesting from 'postcss-nesting';
import autoprefixer from 'autoprefixer';
import sugarss from 'sugarss';

const isDebug = false;

module.exports = {
  devtool: 'source-map',

  entry: [
    './src/main.js'
  ],

  output: {
    path: path.join(__dirname, '/public'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
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
              localIdentName: '[hash:base64:4]',
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

}
