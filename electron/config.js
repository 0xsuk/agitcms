const path = require("path");
const fs = require("fs");

const CONFIG_DIR = path.join(require("os").homedir(), ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const getConfig = () => {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.cpSync(path.join(__dirname, "assets", ".agitcms"), CONFIG_DIR, {
        recursive: true,
      });
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
    return config;
  } catch (err) {
    throw new Error("Failed to load config\n" + err);
  }
};

module.exports = {
  getConfig,
  CONFIG_DIR,
  CONFIG_FILE,
};
