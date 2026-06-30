import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { startUDPServer } from "./services/udpServer.js";
import { startWSServer } from "./services/wsServer.js";
import { startHTTPServer } from "./services/httpServer.js";
import { registerIPCHandlers } from "./ipc/ipcHandlers.js";
import { startBonjour } from "./bonjourServer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");

  // Solo para desarrollo
  win.webContents.openDevTools();

  return win;
}

app.whenReady().then(() => {
  const mainWindow = createWindow();

  startUDPServer(mainWindow);
  startWSServer(mainWindow);
  startHTTPServer(mainWindow);
  startBonjour();

  registerIPCHandlers(mainWindow);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});