import {BrowserWindow, app } from 'electron'
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 700
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);