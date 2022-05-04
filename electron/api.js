const { dialog } = require("electron");
const fs = require("fs");
const { getConfig, CONFIG_FILE } = require("./config.js");
const path = require("path");
const matter = require("gray-matter");
const YAML = require("yaml");
const ShellProcess = require("./lib/shellprocess.js");

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

exports.saveFile = (e, doc, frontmatter, filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is not probided");
    }

    const yaml_str = YAML.stringify(frontmatter); //if frontmatter is {}, returns {}

    if (Object.keys(frontmatter).length !== 0)
      doc = "---\n" + yaml_str + "---" + doc;

    fs.writeFileSync(filePath, doc);
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
  } catch (err) {
    return { doc: null, frontmatter: null, err };
  }

  try {
    const { content: doc, data } = matter(content);
    return { doc, frontmatter: data, err: null };
  } catch (err) {
    console.log("frontmatter format is not supported", err);
    return { doc: null, frontmatter: {}, err: null };
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
  // TODO: read frontmatter, write!
  try {
    //TODO: if file already exists, writeFileSync overwrites it implicitly
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

let shellProcessList = []; //[shell process...]

exports.runCommand = async (e, command, cwd, cid) => {
  try {
    shellProcessList.forEach((p) => {
      if (p.cid === cid) {
        const message = "Cannot run same command at the same time: " + p.cmd;
        console.log(message);
        throw new Error(message);
      }
    });
    const shellProcess = new ShellProcess(command, cwd, cid);
    shellProcessList.push(shellProcess);
    shellProcess.run();
    shellProcess.process.on("exit", () => {
      console.log("exited:", shellProcess.cmd);
      shellProcessList = shellProcessList.filter(
        (p) => p.cid !== shellProcess.cid
      );
    });
    return { err: null };
  } catch (err) {
    return { err };
  }
};

exports.stopCommand = async (e, cid) => {
  shellProcessList.every((p) => {
    if (p.cid === cid) {
      p.stopIfRunning();
      return false;
    }
    return true;
  });
};
