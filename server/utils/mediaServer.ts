import * as http from "http";
import * as url from "url";
import * as fs from "fs";
import * as path from "path";
import type { AddressInfo } from "net";

export const runMediaServer = (staticPath: string, publicPath: string) => {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url as string);
    const sanitizedPath = path.relative(
      publicPath,
      parsedUrl.pathname as string
    ); //EXAMPLE publicPath: /uploads, pathname: /uploads/img.png, sanitizedPath: /img.png
    let pathname = path.join(staticPath, sanitizedPath); //pathname: /staticpath/img.png

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

  server.listen(0);
  return (server.address() as AddressInfo).port;
};
