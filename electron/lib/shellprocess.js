const { spawn } = require("child_process");
const { getWindow } = require("./window_manager");

class ShellProcess {
  constructor(cmd, cwd, cid) {
    this.cmd = cmd;
    this.cwd = cwd;
    this.cid = cid;
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
    this.emitLines(process.stdout);

    process.stdout.on("line", (line) => {
      const win = getWindow();
      win?.webContents.send("shellprocess-line", { line });
    });
    //TODO: stderr.on data
  }

  stopIfRunning() {
    if (this.process !== undefined) {
      this.process.stdout.emit("line", "killed");
      this.process.kill();
      console.log("killed", this.cmd);
    }
  }

  emitLines(stream) {
    var backlog = "";
    stream.on("data", (data) => {
      backlog += data;
      var n = backlog.indexOf("\n");
      // got a \n? emit one or more 'line' events
      while (~n) {
        stream.emit("line", backlog.substring(0, n));
        backlog = backlog.substring(n + 1);
        n = backlog.indexOf("\n");
      }
    });
    stream.on("end", function () {
      if (backlog) {
        stream.emit("line", backlog);
      }
      stream.emit("line", "end");
    });
  }
}

module.exports = ShellProcess;
