import * as os from "os";

export const isWin = os.platform() === "win32";

export const defaultShell = isWin ? "powershell.exe" : process.env.SHELL; //TODO get default shell
