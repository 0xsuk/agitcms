import * as os from "os";

export const defaultShell =
  os.platform() === "win32" ? "powershell.exe" : process.env.SHELL; //TODO get default shell
