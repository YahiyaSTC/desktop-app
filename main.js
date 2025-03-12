// import { app, BrowserWindow } from 'electron';
// import { fileURLToPath } from 'url';
// import path from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// let mainWindow;

// app.whenReady().then(() => {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       webSecurity: false,
//     },
//   });

//   const startURL = false ? `file://${path.join(__dirname, 'dist', 'index.html')}`
//     : 'http://localhost:5173';

//   mainWindow.loadURL(startURL);
//   // mainWindow.webContents.openDevTools(); // Open DevTools to check errors
// });


import { app, BrowserWindow, Tray, Menu } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let tray;

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        createMainWindow();
        createTray();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createMainWindow();
            }
        });
    });

    app.on('window-all-closed', (event) => {
        event.preventDefault(); // Prevent quitting when closing window
    });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: true, // Start hidden
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        }
    });

    const startURL = false ? `file://${path.join(__dirname, 'dist', 'index.html')}`
        : 'http://localhost:5173';

    mainWindow.loadURL(startURL);
    // mainWindow.webContents.openDevTools(); // Open DevTools to check errors

    // Hide window instead of closing
    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click: () => mainWindow.show() },
        {
            label: 'Exit', click: () => {
                mainWindow.destroy();
                app.quit();
            }
        }
    ]);

    tray.setToolTip('My Electron App');
    tray.setContextMenu(contextMenu);

    // Toggle window visibility when clicking the tray icon
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
}
