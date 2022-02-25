const { dialog } = require("electron");
const fs = require("fs");
const HOME_DIR = require("os").homedir();
const path = require("path");

exports.loadConfig = async () => {
  const data = fs.readFileSync(path.join(HOME_DIR, ".varfile.json"));
  //TODO err handling
  const json_data = JSON.parse(data);
  return json_data;
};

exports.saveNewFile = async (e, content) => {
  const err = dialog
    .showSaveDialog({
      // defaultPath: "abc", => works!
      // properties: [""],
    })
    .then(({ canceled, filePath }) => {
      if (canceled) return;
      fs.writeFileSync(filePath, content);
      throw new Error("new err!");
    })
    .catch((err) => {
      //catching err from fs.writeFileSync
      console.log("new err?", err);
      return err;
    });

  return err;
};
