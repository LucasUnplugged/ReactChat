'use strict';

process.env.NODE_ENV = 'development';

const isProduction = process.env.NODE_ENV === 'production';
let port = isProduction ? process.env.PORT : 3000;
if (!port) port = 3000;

const path = require('path');
const paths = require('../config/paths');
const express = require('express');
const app = express();
app.use(express.static(path.resolve(__dirname, 'public')));

const http = require('http').Server(app); // eslint-disable-line new-cap
const io = require('socket.io')(http);
const historyApiFallback = require('connect-history-api-fallback');
const isInteractive = process.stdout.isTTY;
const clearConsole = require('react-dev-utils/clearConsole');
const chalk = require('chalk');
const openBrowser = require('react-dev-utils/openBrowser');

var savedMessages = false;
var wipeMessages;

io.on('connection', (socket) => {
  console.log('User connected');

  if (savedMessages) {
      console.log('Broadcasting update to all clients (new client connected)...');
      io.emit('stateLoad', savedMessages);
  }

  socket.on('disconnect', function(){
    console.log('User disconnected');
  });

  socket.on('stateChange', function(message){
      if (message.id) {
          console.log('State change at client: ' + message.id);
          console.log('Broadcasting update to all clients...');
          io.emit('stateChange', message);
          if (message.state.messages) {
              savedMessages = message;

              // Only keep messages saved for 1 hour, unless users
              // are actively adding new messages.
              clearTimeout(wipeMessages);
              wipeMessages = setTimeout( function() {
                  savedMessages = false;
              }, 3600000 ); // 1 hour
          }
      }
  });
});

http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

if (!isProduction) {
  const protocol = process.env.HTTPS === 'true' ? "https" : "http";
  const host = process.env.HOST || 'localhost';
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('../config/webpack.config.dev');
  const devServerOptions = {
        compress: true,
        clientLogLevel: 'none',
        contentBase: paths.appPublic,
        hot: true,
        publicPath: config.output.publicPath,
        quiet: true,
        watchOptions: {
          ignored: /node_modules/
        },
        https: protocol === 'https',
        host: host
    };

  const compiler = webpack(config);

  const devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    https: protocol === "https",
    host: host
  });
  /* */

  // Our custom middleware proxies requests to /index.html or a remote API.
  addMiddleware(devServer);

  // Launch WebpackDevServer.
  devServer.listen(8080, (err, result) => {
    console.log('Webpack Dev Server listening at 8080');

    if (err) {
      return console.log(err);
    }

    if (isInteractive) {
      clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...'));
    console.log();

    if (isInteractive) {
      openBrowser(protocol + '://' + host + ':' + 8080 + '/');
    }
  });
}



function addMiddleware(devServer) {
  var proxy = require(paths.appPackageJson).proxy;
  devServer.use(historyApiFallback({
    disableDotRule: true,
    htmlAcceptHeaders: proxy ?
      ['text/html'] :
      ['text/html', '*/*']
  }));
  if (proxy) {
    if (typeof proxy !== 'string') {
      console.log(chalk.red('When specified, "proxy" in package.json must be a string.'));
      console.log(chalk.red('Instead, the type of "proxy" was "' + typeof proxy + '".'));
      console.log(chalk.red('Either remove "proxy" from package.json, or make it a string.'));
      process.exit(1);
    }

    var mayProxy = /^(?!\/(index\.html$|.*\.hot-update\.json$|sockjs-node\/)).*$/;

    var hpm = httpProxyMiddleware(pathname => mayProxy.test(pathname), {
      target: proxy,
      logLevel: 'silent',
      onProxyReq: function(proxyReq, req, res) {
        if (proxyReq.getHeader('origin')) {
          proxyReq.setHeader('origin', proxy);
        }
      },
      onError: onProxyError(proxy),
      secure: false,
      changeOrigin: true,
      ws: true
    });
    devServer.use(mayProxy, hpm);

    devServer.listeningApp.on('upgrade', hpm.upgrade);
  }

  devServer.use(devServer.middleware);
}
