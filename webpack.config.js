const CreateFileWebpack = require('create-file-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const { figmaPlugin } = require('./package.json');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  devServer: {
    https: true,
  },
  optimization: {
    minimize: argv.mode === 'production',
    minimizer:
      argv.mode === 'production'
        ? [
            new TerserPlugin({
              terserOptions: {
                mangle: true,
              },
            }),
          ]
        : [],
  },
  entry: {
    ui: './src/App.tsx',
    code: './src/main/index.ts',
  },
  watchOptions: {
    ignored: ['node_modules/**'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx', // Or 'ts' if you don't need tsx
          target: 'es2015',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|webp|svg|zip|mp3)$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, figmaPlugin.name),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
      inject: false,
      templateContent: ({ compilation, htmlWebpackPlugin }) => `
        <html>
          <body>
          <div id="app"></div>
          ${htmlWebpackPlugin.files.js.map(
            (jsFile) =>
              `<script>${compilation.assets[
                jsFile.substr(htmlWebpackPlugin.files.publicPath.length)
              ].source()}</script>`
          )}
          </body>
        </html>
      `,
    }),
    new webpack.DefinePlugin({
      process: {
        env: {
          REACT_APP_SC_ATTR: JSON.stringify('data-styled-figma-measure'),
          SC_ATTR: JSON.stringify('data-styled-figma-measure'),
          REACT_APP_SC_DISABLE_SPEEDY: JSON.stringify('false'),
        },
      },
    }),
    new CreateFileWebpack({
      path: path.resolve(__dirname, figmaPlugin.name),
      fileName: 'manifest.json',
      content: JSON.stringify(figmaPlugin),
    }),
  ],
});
