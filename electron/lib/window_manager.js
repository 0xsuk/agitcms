const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev"); //is not a devDependencies
const path = require("path");

let win = undefined;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
    },
  });

  console.log(__dirname);

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "..", "..", "/index.html")}` //be careful on relative path //TODO
  );
};

const getWindow = () => win;

module.exports = {
  createWindow,
  getWindow,
};
