import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });
  
  const startURL = false ? `file://${path.join(__dirname, 'dist', 'index.html')}`
    : 'http://localhost:5173';

  mainWindow.loadURL(startURL);
  // mainWindow.webContents.openDevTools(); // Open DevTools to check errors
});
