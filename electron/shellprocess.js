const { spawn } = require("child_process");
let processes = []; //[{cid: 1, process}]

class ShellProcess {
  constructor(cmd, args, cwd, cid) {
    processes.forEach((process) => {
      if (process.cid === cid) {
        throw new Error("Cannot run same command at the same time");
      }
    });
    this.cmd = cmd;
    this.args = args;
    this.cwd = cwd;
    this.cid = cid;
    this.process = undefined;
  }

  async run() {
    const process = spawn(this.cmd, this.args, {
      cwd: this.cwd,
    });
    this.process = process;
    process.push({ cid: this.cid, process });
  }

  async stopIfRunning() {
    if (this.process !== undefined) {
      this.process.kill();
      processes = processes.filter((process) => process.cid !== this.cid);
    }
  }
}

module.exports = {
  processes,
  ShellProcess,
};
