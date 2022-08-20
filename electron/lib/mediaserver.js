const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const DEFAULT_PORT = 0; //random
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
    currentServer = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      const sanitizedPath = path.relative(this.publicPath, parsedUrl.pathname); //EXAMPLE publicPath: /uploads, pathname: /uploads/img.png, sanitizedPath: /img.png
      let pathname = path.join(this.staticPath, sanitizedPath); //pathname: /staticpath/img.png

      if (!fs.existsSync(pathname)) {
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
        return;
      }
      fs.readFile(pathname, function (err, data) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error in getting the file.`);
          return;
        }
        res.end(data);
      });
    });
    currentServer.listen(DEFAULT_PORT);
    return currentServer;
  }
};
