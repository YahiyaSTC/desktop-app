import { app, BrowserWindow, Tray, Menu, dialog } from 'electron';
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

    const customMenu = Menu.buildFromTemplate([
        {
            label: 'Navigation',
            submenu: [
                {
                    label: 'Back',
                    accelerator: 'Alt+Left',
                    click: () => {
                        if (mainWindow.webContents.canGoBack()) {
                            mainWindow.webContents.goBack();
                        }
                    }
                },
                {
                    label: 'Forward',
                    accelerator: 'Alt+Right',
                    click: () => {
                        if (mainWindow.webContents.canGoForward()) {
                            mainWindow.webContents.goForward();
                        }
                    }
                }
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Get Current URL',
                    click: () => {
                        const currentURL = mainWindow.webContents.getURL();
                        dialog.showMessageBox({
                            type: 'info',
                            title: 'Current URL',
                            message: `Current URL: ${currentURL}`
                        });
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' }, // Adds "Reload" option
                { role: 'toggledevtools' } // Adds "Toggle Developer Tools"
            ]
        },
        {
            label: 'File',
            submenu: [
                { role: 'quit' } // Adds "Quit" option
            ]
        }
    ]);

    // Set the custom menu
    Menu.setApplicationMenu(customMenu);

    const startURL = false ? `file://${path.join(__dirname, 'dist', 'index.html')}`
        : 'https://console.indolj.com';

    mainWindow.loadURL(startURL);
    mainWindow.autoHideMenuBar = true;
    mainWindow.setMenu(null); // remove default menu
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
