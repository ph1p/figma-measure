import CreateFileWebpack from 'create-file-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

import pkg from './package.json' with { type: 'json' };

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const webpackConfig = (env, argv) => ({
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
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, pkg.figmaPlugin.name.replace(/\s/g, '-')),
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
              ].source()}</script>`,
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
      path: path.resolve(__dirname, pkg.figmaPlugin.name.replace(/\s/g, '-')),
      fileName: 'manifest.json',
      content: JSON.stringify(pkg.figmaPlugin),
    }),
  ],
});

export default webpackConfig;
