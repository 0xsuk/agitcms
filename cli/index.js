#!/usr/bin/env node
const { startServer } = require("../dist/main");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "..", "public")));

let port = 3131;

if (process.env.AGIT_FRONTEND) {
  const newPort = parseInt(process.env.AGIT_FRONTEND);
  if (newPort !== NaN && newPort >= 0) {
    port = newPort;
  }
}

startServer(() => {
  //once backend started
  app.listen(port, () => {
    console.log("Agit CMS is live on: http://localhost:" + port);
  });
});
