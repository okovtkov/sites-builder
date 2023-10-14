#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const stylesHandler = MiniCssExtractPlugin.loader;

const pages = fs.readdirSync('./src/pages').map((page) => {
  const index = page.lastIndexOf('.');
  const strPage = page;
  return strPage.slice(0, index);
});

const config = {
  entry: {
    main: './src/App.js'
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].[contenthash].js',
    clean: true,
  },
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, './src/assets'),
    },
    host: 'localhost',
    hot: true,
  },
  plugins: [new MiniCssExtractPlugin(), ...pages.map((file) => (
    new HtmlWebpackPlugin({
      inject: 'head',
      template: `./src/pages/${file}.pug`,
      filename: `${file}.html`,
    })
  ))],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.(html)$/,
        use: ['html-loader'],
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader',
          options: {
            pretty: true,
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico|avif|mp3)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/img/[name].[hash].[ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      }
    ],
  },
};

module.exports = config;
