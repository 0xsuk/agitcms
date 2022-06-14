const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev"); //is not a devDependencies
const path = require("path");
const {
  setupTitlebar,
  attachTitlebarToWindow,
} = require("custom-electron-titlebar/main");

let win = undefined;

setupTitlebar();

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
    },
  });

  attachTitlebarToWindow(win);

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
