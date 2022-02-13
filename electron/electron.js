const { app, BrowserWindow } = require('electron')
const path = require('path')

// hot reload
require("electron-reload")(__dirname, {
  electron: path.join(__dirname,"..", "node_modules",".bin", "electron")
})


const createWindow = () => {
    const win = new BrowserWindow({
      width: 900,
      height: 700
    })
  
    // win.loadFile('index.html')
    console.log("I love you all!")
    win.loadURL("http://localhost:3000")
  }

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
  })
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
  

