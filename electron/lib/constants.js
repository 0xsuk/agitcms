const os = require("os");
exports.defaultShell =
  os.platform() === "win32" ? "powershell.exe" : process.env.SHELL; //TODO get default shell
