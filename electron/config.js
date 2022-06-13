const path = require("path");
const fs = require("fs");

const CONFIG_DIR = path.join(require("os").homedir(), ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const getConfig = () => {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o775 });
    }
    if (!fs.existsSync(CONFIG_FILE)) {
      let config_str;
      //const isWin = process.platform === "win32";
      //if (isWin) {
      //  config_str = fs
      //    .readFileSync(path.join(__dirname, "assets", "config.win.json"))
      //    .toString();
      //} else {
      //  config_str = fs
      //    .readFileSync(path.join(__dirname, "assets", "config.unix.json"))
      //    .toString();
      //}
      config_str = fs
        .readFileSync(path.join(__dirname, "assets", "config.json"))
        .toString();
      fs.writeFileSync(CONFIG_FILE, config_str, { mode: 0o664 });
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
    return config;
  } catch (err) {
    throw new Error("Failed to load config\n", err);
  }
};

module.exports = {
  getConfig,
  CONFIG_DIR,
  CONFIG_FILE,
};
