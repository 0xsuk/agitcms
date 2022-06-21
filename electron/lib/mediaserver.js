const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const net = require("net");

const portInUse = (port, callback) => {
  var server = net.createServer(function (socket) {
    socket.write("Echo server\r\n");
    socket.pipe(socket);
  });

  server.on("error", function (e) {
    callback(true);
  });
  server.on("listening", function (e) {
    server.close();
    callback(false);
  });

  server.listen(port, "localhost");
};

const setPort = (port) => {
  return new Promise((resolve, reject) => {
    const looper = (_port) => {
      portInUse(_port, (bool) => {
        if (!bool) {
          resolve(_port);
          return;
        }
        if (_port - port > 20) {
          reject(
            "port " + defaultPort + " to " + defaultPort + 20 + " is closed"
          );
          return;
        }
        looper(_port + 1);
      });
    };
    looper(port);
  });
};

const defaultPort = 3001;
let currentServer = undefined;
module.exports = class MediaServer {
  constructor(staticPath, publicPath) {
    this.staticPath = staticPath;
    if (!publicPath) publicPath = "/";
    if (publicPath[0] !== "/") publicPath = "/" + publicPath;
    this.publicPath = publicPath;
    if (currentServer !== undefined) {
      currentServer.close();
      currentServer = undefined;
    }
  }

  run() {
    if (this.staticPath === undefined) return;
    //TODO: setPort(defaultPort).then((port) => {
    const port = defaultPort;
    currentServer = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      const sanitizePath = path.relative(this.publicPath, parsedUrl.pathname);
      let pathname = path.join(this.staticPath, sanitizePath);

      if (!fs.existsSync(pathname)) {
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
      } else {
        fs.readFile(pathname, function (err, data) {
          if (err) {
            res.statusCode = 500;
            res.end(`Error in getting the file.`);
          } else {
            res.end(data);
          }
        });
      }
    });
    currentServer.listen(port);
    //});
  }
};
