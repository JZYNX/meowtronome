"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
let win;
function createWindow() {
    console.log('Creating Electron window...');
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    if (electron_is_dev_1.default) {
        console.log('Running in development mode. Loading URL: http://localhost:3000');
        win.loadURL('http://localhost:3000');
    }
    else {
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
electron_1.app.whenReady().then(() => {
    console.log('Electron app is ready.');
    createWindow();
    electron_1.app.on('activate', () => {
        console.log('App activated.');
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.ipcMain.on('app/close', () => {
    console.log('Received app/close event. Quitting app...');
    electron_1.app.quit();
});
electron_1.app.on('window-all-closed', () => {
    console.log('All windows closed.');
    if (process.platform !== 'darwin') {
        console.log('Quitting app (non-macOS platform).');
        electron_1.app.quit();
    }
});
