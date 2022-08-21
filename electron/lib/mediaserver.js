const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const DEFAULT_PORT = 0; //random
module.exports = class MediaServer {
  server;
  staticPath;
  publicPath;
  constructor(staticPath, publicPath) {
    this.staticPath = staticPath;
    if (!publicPath) publicPath = "/";
    if (publicPath[0] !== "/") publicPath = "/" + publicPath;
    this.publicPath = publicPath;
  }

  run() {
    if (this.staticPath === undefined) return;
    this.server = http.createServer((req, res) => {
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
    this.server.listen(DEFAULT_PORT);
    return this.server;
  }
};
