const os = require("os");
const { dialog } = require("electron");
const fs = require("fs");
const { getConfig, CONFIG_FILE } = require("./config.js");
const path = require("path");
const YAML = require("yaml");
const { getWindow } = require("./lib/window_manager");
const ShellProcessManager = require("./lib/shellprocess_manager.js");
const MediaServer = require("./lib/mediaserver.js");

exports.confirm = (_, message) => {
  const win = getWindow();
  const options = {
    type: "question",
    buttons: ["Cancel", "Yes"],
    message,
  };
  const index = dialog.showMessageBoxSync(win, options);
  const isConfirmed = index === 1;

  console.log("ISCONFIRMED:", isConfirmed);
  return isConfirmed;
};

exports.readConfig = () => {
  return { config: getConfig() };
};

exports.updateConfig = (e, newConfig) => {
  try {
    const config_str = JSON.stringify(newConfig);
    fs.writeFileSync(CONFIG_FILE, config_str);

    //if config is updated, reload is required to update CONFIG variable in the main process
    return;
  } catch (err) {
    return err;
  }
};

exports.saveFile = (e, filePath, content) => {
  try {
    if (!filePath) {
      throw new Error("File path is not provided");
    }

    fs.writeFileSync(filePath, content);
    return { err: null };
  } catch (err) {
    return { err };
  }
};

exports.readFile = (e, filePath) => {
  let content;
  try {
    if (!filePath) {
      throw new Error("File path is not provided");
    }

    content = fs.readFileSync(filePath).toString();
    return { content, err: null };
  } catch (err) {
    return { content: null, err };
  }
};

exports.renameFile = (e, oldFilePath, newFileName) => {
  try {
    const newFilePath = path.join(oldFilePath, "..", newFileName);
    fs.renameSync(oldFilePath, newFilePath);

    return { newFilePath, err: null };
  } catch (err) {
    return { newFilePath: null, err };
  }
};

exports.getFolderPath = () => {
  try {
    const folderPaths = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });

    if (folderPaths === undefined) {
      return { folderPath: null, err: null, canceled: true };
    }

    return { folderPath: folderPaths[0], err: null, canceled: false };
  } catch (err) {
    return { folderPath: null, err, canceled: false };
  }
};

exports.getFilesAndFolders = (e, folderPath) => {
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

exports.createFolder = (e, folderPath) => {
  try {
    // response is folderPath
    fs.mkdirSync(folderPath, { recursive: true });
    return { err: null };
  } catch (err) {
    return { err };
  }
};

exports.createFile = (_, filePath, doc, frontmatter, doOverwrite) => {
  try {
    const yaml_str = YAML.stringify(frontmatter);
    if (Object.keys(frontmatter).length !== 0)
      doc = "---\n" + yaml_str + "---" + doc;
    if (doOverwrite) {
      fs.writeFileSync(filePath, doc);
      return { err: null, isFileExists: null };
    }
    const isFileExists = fs.existsSync(filePath);
    if (isFileExists) {
      return { err: null, isFileExists: true };
    }

    fs.writeFileSync(filePath, doc);
    return { err: null, isFileExists: false };
  } catch (err) {
    return { err, isFileExists: null };
  }
};

exports.removeFile = (_, filePath) => {
  try {
    fs.unlinkSync(filePath);
    return { err: null };
  } catch (err) {
    return { err };
  }
};

exports.removeFolder = (_, folderPath) => {
  try {
    fs.rmdirSync(folderPath, { recursive: true });
    return { err: null };
  } catch (err) {
    return { err };
  }
};

const defaultShell = os.platform() === "win32" ? "powershell.exe" : "zsh"; //TODO
const shellProcessManager = new ShellProcessManager();

exports.typeCommand = (_, id, cmd) => {
  shellProcessManager.write(id, cmd);
};

exports.spawnShell = (_, cwd, shell) => {
  if (shell === undefined) shell = defaultShell;
  const id = shellProcessManager.spawn(cwd, shell);

  console.log("shell spawned");
  return id;
};

exports.startMediaServer = (_, staticPath, publicPath) => {
  console.log("startin", staticPath, publicPath);
  const mediaServer = new MediaServer(staticPath, publicPath);
  mediaServer.run();
};
