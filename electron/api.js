const { dialog } = require("electron");
const fs = require("fs");
const { getConfig, CONFIG_FILE, CONFIG_DIR } = require("./config.js");
const path = require("path");
const { getWindow } = require("./lib/window_manager");
const ShellProcessManager = require("./lib/shellprocess_manager.js");
const MediaServer = require("./lib/mediaserver.js");
const { defaultShell } = require("./lib/constants.js");

exports.confirm = (_, message) => {
  const win = getWindow();
  const options = {
    type: "question",
    buttons: ["Cancel", "Yes"],
    message,
  };
  const index = dialog.showMessageBoxSync(win, options);
  const isConfirmed = index === 1;

  return isConfirmed;
};

exports.readConfig = () => {
  return { config: getConfig() };
};

exports.updateConfig = (_, newConfig) => {
  try {
    const config_str = JSON.stringify(newConfig);
    fs.writeFileSync(CONFIG_FILE, config_str);

    //if config is updated, reload is required to update CONFIG variable in the main process
    return;
  } catch (err) {
    return err;
  }
};

exports.saveFile = (_, filePath, content) => {
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

exports.readFile = (_, filePath) => {
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

exports.renameFileOrFolder = (_, oldPath, newPath) => {
  try {
    if (!oldPath || !newPath) {
      throw new Error("Path is not provided");
    }
    fs.renameSync(oldPath, newPath);
    return { err: null };
  } catch (err) {
    return { err };
  }
};

exports.getFolderPath = (_, defaultPath) => {
  try {
    const folderPaths = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
      defaultPath,
    });

    if (folderPaths === undefined) {
      return { folderPath: null, err: null, canceled: true };
    }

    return { folderPath: folderPaths[0], err: null, canceled: false };
  } catch (err) {
    return { folderPath: null, err, canceled: false };
  }
};

exports.getFilesAndFolders = (_, folderPath) => {
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

exports.getMediaFile = (_, staticPath, publicPath) => {
  if (staticPath === undefined)
    return {
      err: new Error("static path not provided"),
      filePath: null,
      canceled: false,
    };
  try {
    const filePaths = dialog.showOpenDialogSync({
      defaultPath: staticPath,
      buttonLabel: "Copy Path",
      properties: ["openFile"],
    });
    if (filePaths === undefined) {
      //canceled
      return { err: null, filePath: null, canceled: true };
    }

    let filePath = filePaths[0];
    filePath = path.relative(staticPath, filePath);
    filePath = path.join(publicPath, filePath);
    filePath = filePath.replaceAll("\\", "/"); //for windows

    return { err: null, filePath, canceled: false };
  } catch (err) {
    return { err, filePath: null, canceled: false };
  }
};

exports.createFolder = (_, folderPath) => {
  try {
    // response is folderPath
    fs.mkdirSync(folderPath, { recursive: true });
    return { err: null };
  } catch (err) {
    return { err };
  }
};

exports.createFile = (_, filePath, content, doOverwrite) => {
  //TODO remove this block
  try {
    if (doOverwrite) {
      fs.writeFileSync(filePath, content);
      return { err: null, isFileExists: null };
    }
    const isFileExists = fs.existsSync(filePath);
    if (isFileExists) {
      return { err: null, isFileExists: true };
    }

    fs.writeFileSync(filePath, content);
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

const shellProcessManager = new ShellProcessManager();

exports.typeCommand = (_, id, cmd) => {
  shellProcessManager.write(id, cmd);
};

exports.spawnShell = (_, cwd, shell) => {
  if (shell === undefined) shell = defaultShell;
  const id = shellProcessManager.spawn(cwd, shell);

  return id;
};

exports.startMediaServer = (_, staticPath, publicPath) => {
  const mediaServer = new MediaServer(staticPath, publicPath);
  const server = mediaServer.run();
  const port = server.address().port;

  return port;
};

exports.saveImage = (_, filePath, binary) => {
  try {
    fs.writeFileSync(filePath, binary, "binary");
    return null;
  } catch (err) {
    return err;
  }
};

exports.loadPlugins = () => {
  const pluginFolder = path.join(CONFIG_DIR, "plugins");
  const res = exports.getFilesAndFolders(null, pluginFolder);
  if (res.err) {
    return { err: res.err };
  }

  const plugins = res.filesAndFolders
    .filter((dirent) => dirent.isDir === false && dirent.extension === ".js")
    .map((file) => {
      const filePath = path.join(pluginFolder, file.name);
      return {
        name: file.name,
        path: filePath,
        raw: exports.readFile(null, filePath).content,
      };
    });

  return { plugins, err: null };
};
