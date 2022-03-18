const { spawn } = require("child_process");

class ShellProcess {
  constructor(cmd, args, cwd) {
    this.cmd = cmd;
    this.args = args;
    this.cwd = cwd;
    this.process = undefined;
  }

  async run() {
    const process = spawn(this.cmd, this.args, {
      cwd: this.cwd,
    });
    this.process = process;
    //TODO output console
  }

  stopIfRunning() {
    if (this.process !== undefined) {
      this.process.kill();
    }
  }
}

module.exports = ShellProcess;
