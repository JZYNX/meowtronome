import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    closeapp: () => ipcRenderer.send("app/close"),
});