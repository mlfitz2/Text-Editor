const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      // Webpack plugin that generates our html file and injects our bundles. 
      new HtmlWebpackPlugin({
        template: './index.html', // creates a copy of the ./index.html file in the dist folder and inserts in script tags to the newly created bundle.js files automatically
        title: 'Text Editor' // optional parameters
      }),
     
      // Injects our custom service worker
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),
      // Creates a manifest.json file.
      new WebpackPwaManifest({  // PWA options defined here
        fingerprints: false,
        inject: true,
        name: 'Text Editor',
        short_name: 'Editor',
        description: 'Just Another Text Editor',
        background_color: '#225ca3',
        theme_color: '#225ca3',
        start_url: '/',
        publicPath: '/',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,  //this code also looks for a .css file and adds this into the bundle.js file
          use: ['style-loader', 'css-loader'],  // additional modules for converting the css into js
        },
        // {
        //   test: /\.(png|svg|jpg|jpeg|gif)$/i, // searches for image files with these extensions to include
        //   type: 'asset/resource'
        // },
        {
          test: /\.m?js$/,  // looks for .js files
          exclude: /(node_modules|bower_components)/,  // ignores these files
          use: {
            loader: 'babel-loader', // babel is an additional npm module that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments.
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            }
          }
        }
  
      ],
    },
  };
};