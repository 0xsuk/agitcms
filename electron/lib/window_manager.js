const { shell, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev"); //is not a devDependencies
const path = require("path");
const {
  setupTitlebar,
  attachTitlebarToWindow,
} = require("custom-electron-titlebar/main");

let win = undefined;

setupTitlebar();

const createWindow = () => {
  //Menu.setApplicationMenu(null);

  win = new BrowserWindow({
    width: 1200,
    height: 900,
    titleBarStyle: "hidden",
    frame: false,
    minWidth: 400,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload.js"),
    },
  });

  attachTitlebarToWindow(win);

  win
    .loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "..", "..", "/index.html")}` //be careful on relative path //TODO
    )
    .then(() => {
      console.log("hye");
      win.webContents.setWindowOpenHandler(({ url }) => {
        console.log(url);
        shell.openExternal(url);
        return { action: "deny" };
      });
    });
};

const getWindow = () => win;

module.exports = {
  createWindow,
  getWindow,
};
