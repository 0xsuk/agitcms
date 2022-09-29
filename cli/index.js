#!/usr/bin/env node
const { startServer } = require("../dist/main");
const path = require("path");
const http = require("http");
const url = require("url");
const fs = require("fs");

const publicDir = path.join(__dirname, "..", "public");

const frontendServer = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  let fullpath = path.join(publicDir, pathname);

  const ext = path.parse(fullpath).ext || ".html";
  // maps file extension to MIME typere
  const map = {
    ".ico": "image/x-icon",
    ".html": "text/html",
    ".js": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
  };

  const exist = fs.existsSync(fullpath);
  if (!exist) {
    // if the file is not found, return 404
    res.statusCode = 404;
    res.end(`File ${pathname} not found!`);
    return;
  }

  if (fs.statSync(fullpath).isDirectory())
    fullpath = path.join(fullpath, "index.html");

  // read file from file system
  fs.readFile(fullpath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      // if the file is found, set Content-type and send data
      res.setHeader("Content-type", map[ext] || "text/plain");
      res.end(data);
    }
  });
});

let port = 3131;
if (process.env.AGIT_FRONTEND) {
  const newPort = parseInt(process.env.AGIT_FRONTEND);
  if (newPort !== NaN && newPort >= 0) {
    port = newPort;
  }
}
startServer(() => {
  //once backend started
  frontendServer.listen(port, () => {
    console.log("Agit CMS is live on: http://localhost:" + port);
  });
});
