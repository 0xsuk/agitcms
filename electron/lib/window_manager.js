const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev"); //is not a devDependencies
const path = require("path");

let win = undefined;

const createWindow = () => {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../index.html")}` //be careful on relative path
  );
};

const getWindow = () => win;

module.exports = {
  createWindow,
  getWindow,
};
