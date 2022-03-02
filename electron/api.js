const { dialog } = require("electron");
const fs = require("fs");
const HOME_DIR = require("os").homedir();
const path = require("path");

const CONFIG_DIR = path.join(HOME_DIR, ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

exports.loadConfig = async () => {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0775 });
    }
    if (!fs.existsSync(CONFIG_FILE)) {
      const config_str = fs
        .readFileSync(path.join(__dirname, "assets", "config.json"))
        .toString();
      fs.writeFileSync(CONFIG_FILE, config_str, { mode: 0664 });
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
    return { config, err: null };
  } catch (err) {
    return { config: null, err };
  }
};

exports.updateConfig = async (e, newConfig) => {
  try {
    console.log("New Config:", newConfig);
    const config_str = JSON.stringify(newConfig);
    fs.writeFileSync(CONFIG_FILE, config_str);
    return;
  } catch (err) {
    return err;
  }
};

exports.saveFile = async (e, content, filePath) => {
  console.log("saving", filePath);
  if (filePath == "") {
    filePath = dialog.showSaveDialogSync();
  }

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
  try {
    const filePaths = dialog.showOpenDialogSync();
    //if canceled
    if (filePaths == undefined) {
      return { content: null, filePath: null, err: null, canceled: true };
    }

    const content = fs.readFileSync(filePaths[0]).toString();
    return { content, filePath: filePaths[0], err: null, canceled: false };
  } catch (err) {
    return { content: null, filePath: filePaths[0], err, canceled: false };
  }
};

exports.getFolderPath = async () => {
  try {
    const folderPaths = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });

    if (folderPaths == undefined) {
      return { folderPath: null, err: null, canceled: true };
    }

    return { folderPath: folderPaths[0], err: null, canceled: false };
  } catch (err) {
    return { folderPath: null, err, canceled: false };
  }
};
