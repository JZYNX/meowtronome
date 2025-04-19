import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import isDev from 'electron-is-dev';

let win: BrowserWindow | null;

function createWindow() {
    console.log('Creating Electron window...');

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (isDev) {
        console.log('Running in development mode. Loading URL: http://localhost:3000');
        win.loadURL('http://localhost:3000');
    } else {
        const productionPath = path.join(__dirname, '../out/index.html');
        console.log(`Running in production mode. Loading file: ${productionPath}`);
        win.loadFile(productionPath);
    }

    console.log('Opening DevTools...');
    win.webContents.openDevTools();

    win.on('closed', () => {
        console.log('Window closed.');
        win = null;
    });
}

app.whenReady().then(() => {
    console.log('Electron app is ready.');
    createWindow();

    app.on('activate', () => {
        console.log('App activated.');
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

ipcMain.on('app/close', () => {
    console.log('Received app/close event. Quitting app...');
    app.quit();
});

app.on('window-all-closed', () => {
    console.log('All windows closed.');
    if (process.platform !== 'darwin') {
        console.log('Quitting app (non-macOS platform).');
        app.quit();
    }
});