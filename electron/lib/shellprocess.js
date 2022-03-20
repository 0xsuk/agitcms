const { spawn } = require("child_process");

class ShellProcess {
  constructor(cmd, cwd) {
    this.cmd = cmd;
    this.cwd = cwd;
    this.process = undefined;
  }

  async run() {
    const process = spawn(this.cmd, this.args, {
      cwd: this.cwd,
      shell: true,
    });
    this.process = process;
    process.on("error", (err) => {
      throw err;
    });
    //TODO output console
    process.stdout.on("data", (data) => console.log(data.toString()));
  }

  stopIfRunning() {
    if (this.process !== undefined) {
      this.process.kill();
      console.log("killed", this.cmd);
    }
  }
}

module.exports = ShellProcess;
