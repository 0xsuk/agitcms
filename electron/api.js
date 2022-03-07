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
    const config_str = JSON.stringify(newConfig);
    fs.writeFileSync(CONFIG_FILE, config_str);
    return;
  } catch (err) {
    return err;
  }
};

exports.saveFile = async (e, content, filePath) => {
  try {
    if (!filePath) {
      filePath = dialog.showSaveDialogSync();
    }

    //if canceled
    if (filePath == undefined) {
      return { err: null, canceled: true };
    }

    fs.writeFileSync(filePath, content);
    return { err: null, canceled: false };
  } catch (err) {
    return { err, canceled: false };
  }
};

//filePath is optional
exports.readFile = async (e, filePath) => {
  try {
    if (!filePath) {
      const filePaths = dialog.showOpenDialogSync();
      if (filePaths == undefined) {
        return { content: null, filePath: null, err: null, canceled: true };
      }
      filePath = filePaths[0];
    }
    //if canceled

    const content = fs.readFileSync(filePath).toString();
    return { content, filePath, err: null, canceled: false };
  } catch (err) {
    return { content: null, filePath: null, err, canceled: false };
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

//Not used
exports.getFolders = async (e, folderPath) => {
  try {
    const dirents = fs.readdirSync(folderPath, { withFileTypes: true });
    const folders = dirents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    return { folders, err: null };
  } catch (err) {
    return { folders: null, err };
  }
};

exports.getFilesAndFolders = async (e, folderPath) => {
  try {
    const dirents = fs.readdirSync(folderPath, { withFileTypes: true });
    const filesAndFolders = dirents.map((dirent) => ({
      name: dirent.name,
      isDir: dirent.isDirectory(),
      extension: path.extname(dirent.name).toLowerCase(),
    }));
    return { filesAndFolders, err: null };
  } catch (err) {
    return { filesAndFolders: null, err };
  }
};
