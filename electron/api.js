const fs = require("fs");
const HOME_DIR = require("os").homedir();
const path = require("path");

exports.loadConfig = async () => {
  const data = fs.readFileSync(path.join(HOME_DIR, ".varfile.json"));
  //TODO err handling
  const json_data = JSON.parse(data);
  return json_data;
};
