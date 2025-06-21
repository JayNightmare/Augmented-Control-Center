// AR Glasses Control Center - Main Application Script

import { AITrainingStudio } from '../modules/ai/ai-training-studio.js';

class ARControlCenter {
    constructor() {
        this.currentSection = 'dashboard';
        this.aiTrainingStudio = new AITrainingStudio();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.initializeDashboard();
        this.startSystemMonitoring();
        this.initializeAITrainingStudio();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');

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
                
                if (buttonText.includes('calibrate')) {
                    this.handleCalibration(buttonText);
                } else if (buttonText.includes('backup')) {
                    this.handleBackup();
                } else if (buttonText.includes('reset')) {
                    this.handleReset();
                }
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
            memory: (Math.random() * 2 + 1).toFixed(1), // 1-3GB
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

    // AI Tools functionality
    // initializeAITools() {
    //     console.log('Initializing AI training tools...');
        
    //     if (this.aiTrainingStudio) {
    //         // AI Training Studio is already initialized, just update the UI
    //         this.logToConsole('AI Training Studio ready', 'success');
    //         this.updateTrainingProgressBars();
    //     } else {
    //         this.logToConsole('AI Training Studio not available', 'error');
    //     }
    // }

    updateTrainingProgress() {
        // Update progress bars based on AI Training Studio status
        if (this.aiTrainingStudio && this.aiTrainingStudio.isTraining) {
            this.updateTrainingProgressBars();
        }
    }

    updateTrainingProgressBars() {
        if (!this.aiTrainingStudio) return;

        // Update gesture recognition progress
        this.updateModelProgress('gesture', 0);
        
        // Update object detection progress
        this.updateModelProgress('objectDetection', 1);
        
        // Update voice recognition progress
        this.updateModelProgress('voiceRecognition', 2);
    }

    updateModelProgress(modelType, index) {
        const modelContainers = document.querySelectorAll('.bg-gray-700.p-4.rounded');
        if (!modelContainers[index]) return;

        const container = modelContainers[index];
        const progressBar = container.querySelector('.bg-blue-600, .bg-yellow-600, .bg-green-600');
        const statusElement = container.querySelector('.text-green-400, .text-yellow-400, .text-blue-400');
        const progressText = container.querySelector('.text-sm.text-gray-400');

        if (!progressBar || !statusElement || !progressText) return;

        const progress = this.aiTrainingStudio.modules.progress.getProgress(modelType) || 0;
        
        // Update progress bar
        progressBar.style.width = `${progress}%`;
        
        // Update progress text
        progressText.textContent = `${Math.round(progress)}% Complete`;
        
        // Update status and colors
        if (progress >= 100) {
            statusElement.textContent = 'Complete';
            statusElement.className = 'text-green-400';
            progressBar.className = 'bg-green-600 h-2 rounded-full';
        } else if (progress > 0) {
            statusElement.textContent = 'Training';
            statusElement.className = 'text-blue-400';
            progressBar.className = 'bg-blue-600 h-2 rounded-full';
        } else {
            statusElement.textContent = 'Queued';
            statusElement.className = 'text-yellow-400';
            progressBar.className = 'bg-yellow-600 h-2 rounded-full';
        }
    }

    // Start periodic progress updates when training is active
    startProgressUpdates() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.progressInterval = setInterval(() => {
            if (this.aiTrainingStudio && this.aiTrainingStudio.isTraining) {
                this.updateTrainingProgressBars();
            }
        }, 500); // Update every 500ms
    }

    stopProgressUpdates() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    // AI Training Studio handlers
    async handleStartTraining() {
        console.log('handleStartTraining called');
        console.log('aiTrainingStudio:', this.aiTrainingStudio);
        console.log('aiTrainingStudio.isTraining:', this.aiTrainingStudio?.isTraining);
        
        if (!this.aiTrainingStudio) {
            this.logToConsole(`AI Training Studio not initialized, ${aiTrainingStudio}`, 'error');
            return;
        }

        try {
            this.logToConsole('Starting AI training session...', 'info');
            this.updateButtonState('start-training-btn', true);
            
            await this.aiTrainingStudio.startTrainingSession();
            
            this.logToConsole('Training session started successfully', 'success');
            this.updateTrainingProgressBars();
            
            // Start periodic progress updates
            this.startProgressUpdates();
            
        } catch (error) {
            console.error('Error in handleStartTraining:', error);
            this.logToConsole(`Failed to start training: ${error.message}`, 'error');
        } finally {
            this.updateButtonState('start-training-btn', false);
        }
    }

    async handleDeployModel() {
        if (!this.aiTrainingStudio) {
            this.logToConsole('AI Training Studio not initialized', 'error');
            return;
        }

        try {
            this.logToConsole('Deploying trained model...', 'info');
            this.updateButtonState('deploy-model-btn', true);
            
            await this.aiTrainingStudio.modules.deployment.deployModel();
            
            this.logToConsole('Model deployed successfully', 'success');
            
        } catch (error) {
            this.logToConsole(`Failed to deploy model: ${error.message}`, 'error');
        } finally {
            this.updateButtonState('deploy-model-btn', false);
        }
    }

    async handleExportData() {
        if (!this.aiTrainingStudio) {
            this.logToConsole('AI Training Studio not initialized', 'error');
            return;
        }

        try {
            this.logToConsole('Exporting training data...', 'info');
            this.updateButtonState('export-data-btn', true);
            
            const data = await this.aiTrainingStudio.modules.dataCollection.exportData();
            
            this.logToConsole(`Exported ${data.samples} training samples`, 'success');
            
        } catch (error) {
            this.logToConsole(`Failed to export data: ${error.message}`, 'error');
        } finally {
            this.updateButtonState('export-data-btn', false);
        }
    }

    async handleResetModel() {
        if (!this.aiTrainingStudio) {
            this.logToConsole('AI Training Studio not initialized', 'error');
            return;
        }

        try {
            this.logToConsole('Resetting AI models...', 'warning');
            this.updateButtonState('reset-model-btn', true);
            
            // Stop progress updates
            this.stopProgressUpdates();
            
            await this.aiTrainingStudio.modules.modelTraining.resetModels();
            
            this.logToConsole('Models reset successfully', 'success');
            this.updateTrainingProgressBars();
            
        } catch (error) {
            this.logToConsole(`Failed to reset models: ${error.message}`, 'error');
        } finally {
            this.updateButtonState('reset-model-btn', false);
        }
    }

    // Console output functionality
    logToConsole(message, type = 'info') {
        const consoleOutput = document.getElementById('ai-console-output');
        if (!consoleOutput) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        
        let colorClass = 'text-gray-400';
        let prefix = 'ℹ️';
        
        switch (type) {
            case 'error':
                colorClass = 'text-red-400';
                prefix = '❌';
                break;
            case 'success':
                colorClass = 'text-green-400';
                prefix = '✅';
                break;
            case 'warning':
                colorClass = 'text-yellow-400';
                prefix = '⚠️';
                break;
            case 'info':
            default:
                colorClass = 'text-blue-400';
                prefix = 'ℹ️';
                break;
        }
        
        logEntry.className = colorClass;
        logEntry.innerHTML = `<span class="text-gray-500">[${timestamp}]</span> ${prefix} ${message}`;
        
        consoleOutput.appendChild(logEntry);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        
        // Keep only last 50 entries
        while (consoleOutput.children.length > 50) {
            consoleOutput.removeChild(consoleOutput.firstChild);
        }
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
            button.className = button.className.replace(' opacity-50', '');
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

    initializeAITrainingStudio() {
        console.log('initializeAITrainingStudio called');
        try {
            console.log('Creating AI Training Studio instance...');
            this.aiTrainingStudio = new AITrainingStudio();
            console.log('AI Training Studio instance created:', this.aiTrainingStudio);
            
            // Set up progress update listeners
            if (this.aiTrainingStudio.modules.progress) {
                console.log('Setting up progress update listeners...');
                this.aiTrainingStudio.modules.progress.onProgressUpdate = (progress) => {
                    console.log('Progress update received:', progress);
                    this.updateTrainingProgressBars();
                    if (progress.modelType) {
                        this.logToConsole(`${progress.modelType} training: ${Math.round(progress.modelProgress)}%`, 'info');
                    } else {
                        this.logToConsole(`Overall training progress: ${Math.round(progress.percentage)}%`, 'info');
                    }
                };
            }
            
            // Initialize the AI Training Studio immediately
            console.log('Initializing AI Training Studio...');
            this.aiTrainingStudio.initialize().then(() => {
                console.log('AI Training Studio initialized successfully');
                this.logToConsole('AI Training Studio initialized successfully', 'success');
                this.updateTrainingProgressBars();
            }).catch(error => {
                console.error('AI Training Studio initialization error:', error);
                this.logToConsole(`Error initializing AI Training Studio: ${error.message}`, 'error');
            });
            
        } catch (error) {
            console.error('Error creating AI Training Studio:', error);
            this.logToConsole(`Error creating AI Training Studio: ${error.message}`, 'error');
        }
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