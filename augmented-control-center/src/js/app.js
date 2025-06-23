// AR Glasses Control Center - Main Application Script

import { logToConsole } from './logToConsole.js';
import { updateTrainingProgressBars } from './updateProgressBars.js';

class ARControlCenter {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.initializeDashboard();
        this.startSystemMonitoring();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.getAttribute('data-section');
                this.switchSection(targetSection);
            });
        });
    }

    switchSection(sectionName) {
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;
        this.onSectionChange(sectionName);
    }

    onSectionChange(sectionName) {
        console.log(`Switched to section: ${sectionName}`);
        
        // Initialize section-specific functionality
        switch(sectionName) {
            case 'dashboard':
                this.updateDashboardMetrics();
                break;
            case 'camera':
                this.initializeCameraFeeds();
                break;
            case 'tracking':
                this.initializeTracking();
                break;
            case 'overlay':
                this.initializeOverlayManager();
                break;
            case 'ai':
                this.initializeAITools();
                break;
            case 'admin':
                this.initializeAdminSettings();
                break;
            case 'monitor':
                this.initializeSystemMonitor();
                break;
        }
    }

    setupEventListeners() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            console.log('AR Control Center initialized');
        });

        // Button event listeners
        this.setupButtonListeners();
    }

    setupButtonListeners() {
        // AI Training Studio buttons
        const startTrainingBtn = document.getElementById('start-training-btn');
        const deployModelBtn = document.getElementById('deploy-model-btn');
        const exportDataBtn = document.getElementById('export-data-btn');
        const resetModelBtn = document.getElementById('reset-model-btn');

        if (startTrainingBtn) {
            startTrainingBtn.addEventListener('click', () => this.handleStartTraining());
        }
        if (deployModelBtn) {
            deployModelBtn.addEventListener('click', () => this.handleDeployModel());
        }
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.handleExportData());
        }
        if (resetModelBtn) {
            resetModelBtn.addEventListener('click', () => this.handleResetModel());
        }

        // Other buttons
        const calibrateButtons = document.querySelectorAll('button:not([id])');
        calibrateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = e.target.textContent.toLowerCase();

                // When a button is clicked, 
            });
        });
    }

    // Dashboard functionality
    initializeDashboard() {
        this.updateDashboardMetrics();
        setInterval(() => {
            this.updateDashboardMetrics();
        }, 5000); // Update every 5 seconds
    }

    updateDashboardMetrics() {
        // Simulate real-time metric updates
        const metrics = {
            battery: Math.floor(Math.random() * 30) + 70, // 70-100%
            cpu: Math.floor(Math.random() * 40) + 30, // 30-70%
            memory: (Math.random() * 2 + 1), // 1-3GB
            temperature: Math.floor(Math.random() * 10) + 38 // 38-48°C
        };

        // Update battery indicator
        const batteryElement = document.querySelector('.flex.justify-between span:contains("Battery")');
        if (batteryElement) {
            batteryElement.nextElementSibling.textContent = `${metrics.battery}%`;
        }

        // Update CPU usage
        const cpuElement = document.querySelector('.flex.justify-between span:contains("CPU Usage")');
        if (cpuElement) {
            cpuElement.nextElementSibling.textContent = `${metrics.cpu}%`;
        }

        // Update memory usage
        const memoryElement = document.querySelector('.flex.justify-between span:contains("Memory")');
        if (memoryElement) {
            memoryElement.nextElementSibling.textContent = `${metrics.memory}GB`;
        }

        // Update temperature
        const tempElement = document.querySelector('.flex.justify-between span:contains("Temperature")');
        if (tempElement) {
            tempElement.nextElementSibling.textContent = `${metrics.temperature}°C`;
        }
    }

    // Camera functionality
    initializeCameraFeeds() {
        console.log('Initializing camera feeds...');
        // Simulate camera feed initialization
        const cameraContainers = document.querySelectorAll('.bg-gray-700.h-64');
        cameraContainers.forEach(container => {
            container.addEventListener('click', () => {
                this.showCameraModal();
            });
        });
    }

    showCameraModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Camera Feed</h3>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="bg-gray-700 h-96 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                        <div class="w-32 h-32 bg-blue-500 rounded-full mx-auto mb-4 animate-pulse"></div>
                        <p class="text-gray-400">Full Screen Camera Feed</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Tracking functionality
    initializeTracking() {
        console.log('Initializing tracking systems...');
        // Simulate tracking data updates
        setInterval(() => {
            this.updateTrackingData();
        }, 2000);
    }

    updateTrackingData() {
        // Simulate hand tracking updates
        const handTrackingElements = document.querySelectorAll('.w-32.h-32.border-2.border-green-400');
        handTrackingElements.forEach(element => {
            const dots = element.querySelectorAll('.w-2.h-2');
            dots.forEach(dot => {
                const x = Math.random() * 80 + 10; // 10-90%
                const y = Math.random() * 80 + 10; // 10-90%
                dot.style.left = `${x}%`;
                dot.style.top = `${y}%`;
            });
        });

        // Simulate eye tracking updates
        const eyeTrackingElements = document.querySelectorAll('.w-8.h-8.border-2.border-blue-400');
        eyeTrackingElements.forEach(element => {
            const pupil = element.querySelector('.w-2.h-2');
            if (pupil) {
                const x = Math.random() * 60 + 20; // 20-80%
                const y = Math.random() * 60 + 20; // 20-80%
                pupil.style.left = `${x}%`;
                pupil.style.top = `${y}%`;
            }
        });
    }

    // Overlay functionality
    initializeOverlayManager() {
        console.log('Initializing overlay manager...');
        // Add overlay toggle functionality
        const overlayToggles = document.querySelectorAll('button:contains("Enable"), button:contains("Disable")');
        overlayToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const button = e.target;
                const statusElement = button.parentElement.querySelector('span');
                
                if (button.textContent === 'Enable') {
                    button.textContent = 'Disable';
                    button.className = 'bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm';
                    statusElement.textContent = 'Active';
                    statusElement.className = 'text-green-400 text-sm';
                } else {
                    button.textContent = 'Enable';
                    button.className = 'bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm';
                    statusElement.textContent = 'Paused';
                    statusElement.className = 'text-yellow-400 text-sm';
                }
            });
        });
    }

    // //

    handleStartTraining() {
        console.log('Start Training button pressed');
        updateTrainingProgressBars(
            {
                'object-detection': 0,
                'gesture-recognition': 0,
                'voice-recognition': 0
            },
            {
                'object-detection': 'in-progress',
                'gesture-recognition': 'in-progress',
                'voice-recognition': 'in-progress'
            }
        );

        logToConsole('Training started...', 'success');
        this.updateButtonState('start-training-btn', false);



        // TODO: Provide functions to 
    }

    handleDeployModel() {
        console.log('Deploy Model button pressed');
    }

    handleExportData() {
        console.log('Export Data button pressed');
    }

    handleResetModel() {
        console.log('Reset Model button pressed');

        // Reset all training progress bars
        updateTrainingProgressBars(
            {
                'object-detection': 0,
                'gesture-recognition': 0,
                'voice-recognition': 0
            },
            {
                'object-detection': 'waiting',
                'gesture-recognition': 'waiting',
                'voice-recognition': 'waiting'
            }
        );

        logToConsole('Model reset successfully', 'success');
    }

    updateButtonState(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.textContent = 'Processing...';
            button.className = button.className.replace('hover:', '') + ' opacity-50';
        } else {
            button.disabled = false;
            // Restore original text based on button ID
            switch (buttonId) {
                case 'start-training-btn':
                    button.textContent = 'Start Training';
                    break;
                case 'deploy-model-btn':
                    button.textContent = 'Deploy Model';
                    break;
                case 'export-data-btn':
                    button.textContent = 'Export Data';
                    break;
                case 'reset-model-btn':
                    button.textContent = 'Reset Model';
                    break;
            }
            button.className = button.className.replace('opacity-50', '');
        }
    }

    // Admin Settings functionality
    initializeAdminSettings() {
        console.log('Initializing admin settings...');
        // Add form validation and save functionality
        const formInputs = document.querySelectorAll('input, select');
        formInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveSetting(input.name || input.id, input.value);
            });
        });
    }

    saveSetting(key, value) {
        console.log(`Saving setting: ${key} = ${value}`);
        // In a real app, this would save to localStorage or send to backend
        localStorage.setItem(`ar_setting_${key}`, value);
    }

    // System Monitor functionality
    initializeSystemMonitor() {
        console.log('Initializing system monitor...');
        this.startSystemMonitoring();
    }

    startSystemMonitoring() {
        // Update system metrics every 2 seconds
        setInterval(() => {
            this.updateSystemMetrics();
        }, 2000);

        // Update system logs every 5 seconds
        setInterval(() => {
            this.updateSystemLogs();
        }, 5000);
    }

    updateSystemMetrics() {
        // Simulate real-time system metrics
        const metrics = {
            cpu: Math.floor(Math.random() * 50) + 20,
            memory: Math.floor(Math.random() * 30) + 20,
            gpu: Math.floor(Math.random() * 40) + 20,
            network: Math.floor(Math.random() * 20) + 5
        };

        // Update progress bars
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const values = [metrics.cpu, metrics.memory, metrics.gpu, metrics.network];
            if (values[index]) {
                bar.style.width = `${values[index]}%`;
                const percentageElement = bar.parentElement.nextElementSibling;
                if (percentageElement) {
                    percentageElement.textContent = `${values[index]}%`;
                }
            }
        });
    }

    updateSystemLogs() {
        const logContainer = document.querySelector('.bg-gray-900.p-4.rounded.h-48');
        if (logContainer) {
            const timestamp = new Date().toLocaleTimeString();
            const logLevels = ['INFO', 'WARN', 'ERROR'];
            const logMessages = [
                'System check completed',
                'Memory usage normal',
                'Network connection stable',
                'Temperature within limits',
                'Background processes running'
            ];
            
            const randomLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
            const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
            const colorClass = randomLevel === 'INFO' ? 'text-green-400' : 
                             randomLevel === 'WARN' ? 'text-yellow-400' : 'text-red-400';
            
            const logEntry = document.createElement('div');
            logEntry.className = colorClass;
            logEntry.textContent = `[${timestamp}] ${randomLevel}: ${randomMessage}`;
            
            logContainer.appendChild(logEntry);
            
            // Keep only last 10 log entries
            while (logContainer.children.length > 10) {
                logContainer.removeChild(logContainer.firstChild);
            }
        }
    }

    // Event handlers
    handleCalibration(type) {
        console.log(`Starting ${type} calibration...`);
        this.showNotification(`Camera ${type} calibration initiated`, 'info');
    }

    handleBackup() {
        console.log('Starting system backup...');
        this.showNotification('System backup initiated', 'info');
    }

    handleReset() {
        console.log('Resetting system...');
        this.showNotification('System reset initiated', 'warning');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} fixed top-4 right-4 z-50`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.arControlCenter = new ARControlCenter();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ARControlCenter;
}