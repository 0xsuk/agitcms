const { dialog } = require("electron");
const fs = require("fs");
const HOME_DIR = require("os").homedir();
const path = require("path");
const matter = require("gray-matter");
const CONFIG_DIR = path.join(HOME_DIR, ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

exports.loadConfig = async () => {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o775 });
    }
    if (!fs.existsSync(CONFIG_FILE)) {
      const config_str = fs
        .readFileSync(path.join(__dirname, "assets", "config.json"))
        .toString();
      fs.writeFileSync(CONFIG_FILE, config_str, { mode: 0o664 });
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
      throw new Error("File path is not probided");
    }

    fs.writeFileSync(filePath, content);
    return { err: null };
  } catch (err) {
    return { err };
  }
};

exports.readFile = async (e, filePath) => {
  let doc;
  try {
    if (!filePath) {
      throw new Error("File path is not provided");
    }

    doc = fs.readFileSync(filePath).toString();
  } catch (err) {
    return { content: null, frontmatter: null, err };
  }

  try {
    const { content, data } = matter(doc);
    return { content, frontmatter: data, err: null };
  } catch (err) {
    console.log("frontmatter format is not supported");
    return { content: doc, frontmatter: {}, err: null };
  }
};

exports.renameFile = async (e, oldFilePath, newFileName) => {
  try {
    const newFilePath = path.join(oldFilePath, "..", newFileName);
    fs.renameSync(oldFilePath, newFilePath);

    return { newFilePath, err: null };
  } catch (err) {
    return { newFilePath: null, err };
  }
};

exports.getFolderPath = async () => {
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
