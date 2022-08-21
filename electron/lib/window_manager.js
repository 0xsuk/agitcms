const { shell, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev"); //is not a devDependencies
const path = require("path");
const {
  setupTitlebar,
  attachTitlebarToWindow,
} = require("custom-electron-titlebar/main");
const { v4 } = require("uuid");

let win;

const defaultWinOptions = {
  width: 1200,
  height: 900,
  titleBarStyle: "hidden",
  frame: false,
  minWidth: 400,
  minHeight: 400,
  webPreferences: {
    preload: path.join(__dirname, "..", "preload.js"),
  },
  transparent: true,
};
class Win {
  id;
  win;
  options;

  constructor(options) {
    this.id = v4();
    const finalOptions = Object.assign(defaultWinOptions, options);
    this.options = finalOptions;
    this.win = new BrowserWindow(finalOptions);

    this.setup();
  }

  async setup() {
    setupTitlebar();
    this.attachTitlebarToWindow();
    await this.loadUrl();
    this.setWindowOpenHandler();
  }

  attachTitlebarToWindow() {
    attachTitlebarToWindow(this.win);
  }

  loadUrl() {
    return this.win.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "..", "..", "/index.html")}` //be careful on relative path
    );
  }

  setWindowOpenHandler() {
    this.win.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "deny" };
    });
  }
}

const createWindow = () => {
  //Menu.setApplicationMenu(null);

  win = new Win();
};

const getWindow = () => {};

const getWindowById = () => {};
module.exports = {
  createWindow,
};
