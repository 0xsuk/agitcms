const path = require("path");
const fs = require("fs");

let config;
const CONFIG_DIR = path.join(require("os").homedir(), ".agitcms");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

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

  config = JSON.parse(fs.readFileSync(CONFIG_FILE));
} catch (err) {
  throw new Error("Failed to load config\n", err);
}

module.exports = {
  CONFIG: config, //exporting config to access root configuration, not config.sites. Once root configuration is updated, reload is required.
  CONFIG_DIR,
  CONFIG_FILE,
};
