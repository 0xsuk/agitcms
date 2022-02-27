const { dialog } = require("electron");
const fs = require("fs");
const HOME_DIR = require("os").homedir();
const path = require("path");

//TODO
const CONFIG = ".varfile.json";

exports.loadConfig = async () => {
  try {
    const config = fs.readFileSync(path.join(HOME_DIR, CONFIG));
    return { config: JSON.parse(config), err: null };
  } catch (err) {
    return { config: null, err };
  }
};

exports.saveNewFile = async (e, content) => {
  const filePath = dialog.showSaveDialogSync();

  //if canceled
  if (filePath == undefined) {
    return { err: null, canceled: true };
  }

  try {
    fs.writeFileSync(filePath, content);
    return { err: null, canceled: false };
  } catch (err) {
    return { err, canceled: false };
  }
};

exports.openFile = async () => {
  const filePaths = dialog.showOpenDialogSync();
  //if canceled
  if (filePaths == undefined) {
    return { content: null, err: null, canceled: true };
  }

  try {
    const content = fs.readFileSync(filePaths[0]).toString();
    return { content, err: null, canceled: false };
  } catch (err) {
    return { content: null, err, canceled: false };
  }
};
