/**
 * AI Training Studio - Central hub for AR Glasses AI training
 * Handles data collection, model training, validation, and deployment
 */

import { DataCollector } from './data-collector.js';
import { ModelTrainer } from './model-trainer.js';
import { ValidationEngine } from './validation-engine.js';
import { DeploymentManager } from './deployment-manager.js';
import { TrainingProgressTracker } from './training-progress-tracker.js';

export class AITrainingStudio {
    constructor() {
        this.modules = {
            dataCollection: new DataCollector(),
            modelTraining: new ModelTrainer(),
            validation: new ValidationEngine(),
            deployment: new DeploymentManager(),
            progress: new TrainingProgressTracker()
        };
        
        this.isTraining = false;
        this.currentSession = null;
        this.trainingConfig = this.getDefaultConfig();
        
        this.initializeEventListeners();
    }

    /**
     * Initialize the AI Training Studio
     */
    async initialize() {
        try {
            console.log('🚀 Initializing AI Training Studio...');
            
            // Initialize all modules
            await Promise.all([
                this.modules.dataCollection.initialize(),
                this.modules.modelTraining.initialize(),
                this.modules.validation.initialize(),
                this.modules.deployment.initialize()
            ]);

            // Load saved configurations
            await this.loadSavedConfigurations();
            
            console.log('✅ AI Training Studio initialized successfully');
            this.updateUI();
            
        } catch (error) {
            console.error('❌ Failed to initialize AI Training Studio:', error);
            this.showError('Failed to initialize AI Training Studio');
        }
    }

    /**
     * Start a new training session
     */
    async startTrainingSession(config = {}) {
        if (this.isTraining) {
            this.showError('Training session already in progress');
            return;
        }

        try {
            this.isTraining = true;
            this.currentSession = {
                id: this.generateSessionId(),
                startTime: new Date(),
                config: { ...this.trainingConfig, ...config },
                status: 'initializing'
            };

            console.log('🎯 Starting AI training session:', this.currentSession.id);
            
            // Update UI
            this.updateTrainingStatus('initializing');
            
            // Initialize data collection
            await this.modules.dataCollection.startCollection(this.currentSession.config);
            
            // Start model training
            await this.modules.modelTraining.startTraining(this.currentSession);
            
            // Start progress tracking for all models
            this.modules.progress.startTracking(this.currentSession.id);
            this.modules.progress.startModelTracking('gesture');
            this.modules.progress.startModelTracking('objectDetection');
            this.modules.progress.startModelTracking('voiceRecognition');
            
            this.currentSession.status = 'training';
            this.updateTrainingStatus('training');
            
            // Trigger initial UI update
            if (this.modules.progress.onProgressUpdate) {
                this.modules.progress.onProgressUpdate({ percentage: 0, status: 'training' });
            }
            
        } catch (error) {
            console.error('❌ Failed to start training session:', error);
            this.showError('Failed to start training session');
            this.isTraining = false;
        }
    }

    /**
     * Stop the current training session
     */
    async stopTrainingSession() {
        if (!this.isTraining) {
            return;
        }

        try {
            console.log('🛑 Stopping training session...');
            
            // Stop data collection
            await this.modules.dataCollection.stopCollection();
            
            // Stop model training
            await this.modules.modelTraining.stopTraining();
            
            // Stop progress tracking
            this.modules.progress.stopTracking();
            this.modules.progress.resetProgress();
            
            // Finalize session
            this.currentSession.status = 'completed';
            this.currentSession.endTime = new Date();
            
            // Save session results
            await this.saveSessionResults();
            
            this.isTraining = false;
            this.updateTrainingStatus('completed');
            
            // Trigger final UI update
            if (this.modules.progress.onProgressUpdate) {
                this.modules.progress.onProgressUpdate({ 
                    percentage: 0, 
                    status: 'completed',
                    message: 'Training session completed'
                });
            }
            
            console.log('✅ Training session completed');
            
        } catch (error) {
            console.error('❌ Error stopping training session:', error);
            this.showError('Error stopping training session');
        }
    }

    /**
     * Train a custom gesture model
     */
    async trainCustomGesture(gestureData, gestureName) {
        try {
            console.log(`🤖 Training custom gesture: ${gestureName}`);
            
            // Preprocess gesture data
            const processedData = await this.modules.dataCollection.preprocessGestureData(gestureData);
            
            // Extract features
            const features = await this.modules.modelTraining.extractGestureFeatures(processedData);
            
            // Train model
            const model = await this.modules.modelTraining.trainGestureModel(features, gestureName);
            
            // Validate model
            const validationResults = await this.modules.validation.validateGestureModel(model, gestureName);
            
            if (validationResults.isValid) {
                // Deploy model
                await this.modules.deployment.deployGestureModel(model, gestureName);
                console.log(`✅ Custom gesture "${gestureName}" trained and deployed successfully`);
                return { success: true, model, validationResults };
            } else {
                console.warn(`⚠️ Gesture "${gestureName}" validation failed:`, validationResults.errors);
                return { success: false, errors: validationResults.errors };
            }
            
        } catch (error) {
            console.error(`❌ Failed to train gesture "${gestureName}":`, error);
            this.showError(`Failed to train gesture: ${gestureName}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Train eye tracking model
     */
    async trainEyeTrackingModel(eyeData, targetPositions) {
        try {
            console.log('👁️ Training eye tracking model...');
            
            // Preprocess eye data
            const processedData = await this.modules.dataCollection.preprocessEyeData(eyeData);
            
            // Train gaze prediction model
            const model = await this.modules.modelTraining.trainGazeModel(processedData, targetPositions);
            
            // Validate model
            const validationResults = await this.modules.validation.validateEyeTrackingModel(model);
            
            if (validationResults.isValid) {
                await this.modules.deployment.deployEyeTrackingModel(model);
                console.log('✅ Eye tracking model trained and deployed successfully');
                return { success: true, model, validationResults };
            } else {
                console.warn('⚠️ Eye tracking model validation failed:', validationResults.errors);
                return { success: false, errors: validationResults.errors };
            }
            
        } catch (error) {
            console.error('❌ Failed to train eye tracking model:', error);
            this.showError('Failed to train eye tracking model');
            return { success: false, error: error.message };
        }
    }

    /**
     * Analyze user behavior patterns
     */
    async analyzeUserBehavior(userData) {
        try {
            console.log('🧠 Analyzing user behavior patterns...');
            
            // Process user interaction data
            const processedData = await this.modules.dataCollection.preprocessUserData(userData);
            
            // Analyze patterns
            const patterns = await this.modules.modelTraining.analyzeBehaviorPatterns(processedData);
            
            // Generate insights
            const insights = await this.modules.modelTraining.generateBehaviorInsights(patterns);
            
            console.log('✅ User behavior analysis completed');
            return { success: true, patterns, insights };
            
        } catch (error) {
            console.error('❌ Failed to analyze user behavior:', error);
            this.showError('Failed to analyze user behavior');
            return { success: false, error: error.message };
        }
    }

    /**
     * Get training progress
     */
    getTrainingProgress() {
        return this.modules.progress.getCurrentProgress();
    }

    /**
     * Get available models
     */
    async getAvailableModels() {
        return await this.modules.deployment.getDeployedModels();
    }

    /**
     * Update training configuration
     */
    updateTrainingConfig(newConfig) {
        this.trainingConfig = { ...this.trainingConfig, ...newConfig };
        this.saveConfiguration();
        console.log('⚙️ Training configuration updated:', this.trainingConfig);
    }

    /**
     * Get default training configuration
     */
    getDefaultConfig() {
        return {
            // Data collection settings
            dataCollection: {
                sampleRate: 30, // Hz
                duration: 60, // seconds
                sensors: ['camera', 'imu', 'eyeTracking', 'handTracking'],
                qualityThreshold: 0.8
            },
            
            // Model training settings
            training: {
                epochs: 50,
                batchSize: 32,
                learningRate: 0.001,
                validationSplit: 0.2,
                earlyStopping: true
            },
            
            // Validation settings
            validation: {
                accuracyThreshold: 0.85,
                confidenceThreshold: 0.8,
                crossValidation: true
            },
            
            // Deployment settings
            deployment: {
                autoDeploy: true,
                versionControl: true,
                rollbackOnFailure: true
            }
        };
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Listen for training progress updates
        this.modules.progress.onProgressUpdate = (progress) => {
            this.updateProgressUI(progress);
        };

        // Listen for validation results
        this.modules.validation.onValidationComplete = (results) => {
            this.updateValidationUI(results);
        };

        // Listen for deployment status
        this.modules.deployment.onDeploymentComplete = (status) => {
            this.updateDeploymentUI(status);
        };
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update training status
        this.updateTrainingStatus(this.currentSession?.status || 'idle');
        
        // Update available models
        this.updateModelsList();
        
        // Update configuration display
        this.updateConfigDisplay();
    }

    /**
     * Update training status in UI
     */
    updateTrainingStatus(status) {
        const statusElement = document.getElementById('ai-training-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `status-${status}`;
        }
    }

    /**
     * Update progress UI
     */
    updateProgressUI(progress) {
        const progressElement = document.getElementById('ai-training-progress');
        if (progressElement) {
            progressElement.style.width = `${progress.percentage}%`;
            progressElement.textContent = `${Math.round(progress.percentage)}%`;
        }
    }

    /**
     * Update validation UI
     */
    updateValidationUI(results) {
        const validationElement = document.getElementById('ai-validation-results');
        if (validationElement) {
            validationElement.innerHTML = `
                <div class="validation-result ${results.isValid ? 'valid' : 'invalid'}">
                    <h4>Validation Results</h4>
                    <p>Accuracy: ${(results.accuracy * 100).toFixed(2)}%</p>
                    <p>Confidence: ${(results.confidence * 100).toFixed(2)}%</p>
                    ${results.errors ? `<p class="errors">Errors: ${results.errors.join(', ')}</p>` : ''}
                </div>
            `;
        }
    }

    /**
     * Update deployment UI
     */
    updateDeploymentUI(status) {
        const deploymentElement = document.getElementById('ai-deployment-status');
        if (deploymentElement) {
            deploymentElement.innerHTML = `
                <div class="deployment-status ${status.success ? 'success' : 'failed'}">
                    <h4>Deployment Status</h4>
                    <p>${status.message}</p>
                    ${status.modelId ? `<p>Model ID: ${status.modelId}</p>` : ''}
                </div>
            `;
        }
    }

    /**
     * Update models list
     */
    async updateModelsList() {
        const models = await this.getAvailableModels();
        const modelsElement = document.getElementById('ai-models-list');
        if (modelsElement) {
            modelsElement.innerHTML = models.map(model => `
                <div class="model-item">
                    <h4>${model.name}</h4>
                    <p>Type: ${model.type}</p>
                    <p>Accuracy: ${(model.accuracy * 100).toFixed(2)}%</p>
                    <p>Deployed: ${new Date(model.deployedAt).toLocaleDateString()}</p>
                </div>
            `).join('');
        }
    }

    /**
     * Update configuration display
     */
    updateConfigDisplay() {
        const configElement = document.getElementById('ai-config-display');
        if (configElement) {
            configElement.innerHTML = `
                <div class="config-section">
                    <h4>Training Configuration</h4>
                    <p>Epochs: ${this.trainingConfig.training.epochs}</p>
                    <p>Learning Rate: ${this.trainingConfig.training.learningRate}</p>
                    <p>Batch Size: ${this.trainingConfig.training.batchSize}</p>
                </div>
            `;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorElement = document.getElementById('ai-error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
        console.error('AI Training Error:', message);
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Save session results
     */
    async saveSessionResults() {
        if (!this.currentSession) return;
        
        try {
            const sessions = JSON.parse(localStorage.getItem('ai_training_sessions') || '[]');
            sessions.push(this.currentSession);
            localStorage.setItem('ai_training_sessions', JSON.stringify(sessions));
        } catch (error) {
            console.error('Failed to save session results:', error);
        }
    }

    /**
     * Load saved configurations
     */
    async loadSavedConfigurations() {
        try {
            const savedConfig = localStorage.getItem('ai_training_config');
            if (savedConfig) {
                this.trainingConfig = { ...this.trainingConfig, ...JSON.parse(savedConfig) };
            }
        } catch (error) {
            console.error('Failed to load saved configurations:', error);
        }
    }

    /**
     * Save configuration
     */
    saveConfiguration() {
        try {
            localStorage.setItem('ai_training_config', JSON.stringify(this.trainingConfig));
        } catch (error) {
            console.error('Failed to save configuration:', error);
        }
    }

    /**
     * Cleanup resources
     */
    async cleanup() {
        if (this.isTraining) {
            await this.stopTrainingSession();
        }
        
        await Promise.all([
            this.modules.dataCollection.cleanup(),
            this.modules.modelTraining.cleanup(),
            this.modules.validation.cleanup(),
            this.modules.deployment.cleanup()
        ]);
        
        console.log('🧹 AI Training Studio cleanup completed');
    }
}

// Export singleton instance
export const aiTrainingStudio = new AITrainingStudio(); 