const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // AI Training Studio communication
    aiTraining: {
        startTraining: (config) => ipcRenderer.invoke('ai-training:start', config),
        stopTraining: () => ipcRenderer.invoke('ai-training:stop'),
        getProgress: () => ipcRenderer.invoke('ai-training:progress'),
        deployModel: () => ipcRenderer.invoke('ai-training:deploy'),
        exportData: () => ipcRenderer.invoke('ai-training:export'),
        resetModel: () => ipcRenderer.invoke('ai-training:reset')
    },
    
    // System monitoring
    system: {
        getMetrics: () => ipcRenderer.invoke('system:metrics'),
        getLogs: () => ipcRenderer.invoke('system:logs')
    },
    
    // File operations
    files: {
        saveData: (data) => ipcRenderer.invoke('files:save', data),
        loadData: (path) => ipcRenderer.invoke('files:load', path)
    }
});

// Listen for progress updates from main process
ipcRenderer.on('ai-training:progress-update', (event, progress) => {
    // Dispatch custom event for the renderer to listen to
    window.dispatchEvent(new CustomEvent('ai-training-progress', { detail: progress }));
});

// Listen for console messages from main process
ipcRenderer.on('ai-training:console-log', (event, message) => {
    window.dispatchEvent(new CustomEvent('ai-training-console', { detail: message }));
}); 