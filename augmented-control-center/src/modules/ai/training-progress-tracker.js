/**
 * Training Progress Tracker - Tracks and reports training progress
 */

export class TrainingProgressTracker {
    constructor() {
        this.progress = {
            percentage: 0,
            status: 'idle',
            sessionId: null
        };
        this.modelProgress = {
            gesture: { percentage: 0, status: 'idle' },
            objectDetection: { percentage: 0, status: 'idle' },
            voiceRecognition: { percentage: 0, status: 'idle' }
        };
        this.onProgressUpdate = null;
        this.interval = null;
    }

    /**
     * Start tracking progress for a session
     */
    startTracking(sessionId) {
        this.progress = {
            percentage: 0,
            status: 'training',
            sessionId
        };
        this.simulateProgress();
    }

    /**
     * Start tracking progress for a specific model
     */
    startModelTracking(modelType) {
        if (this.modelProgress[modelType]) {
            this.modelProgress[modelType] = {
                percentage: 0,
                status: 'training'
            };
            this.simulateModelProgress(modelType);
        }
    }

    /**
     * Simulate progress updates (mock)
     */
    simulateProgress() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.progress.percentage < 100) {
                this.progress.percentage += Math.random() * 10;
                if (this.progress.percentage > 100) this.progress.percentage = 100;
                if (this.onProgressUpdate) this.onProgressUpdate(this.progress);
            } else {
                this.progress.status = 'completed';
                clearInterval(this.interval);
                if (this.onProgressUpdate) this.onProgressUpdate(this.progress);
            }
        }, 500);
    }

    /**
     * Simulate progress for a specific model
     */
    simulateModelProgress(modelType) {
        const model = this.modelProgress[modelType];
        if (!model) return;

        const interval = setInterval(() => {
            if (model.percentage < 100) {
                model.percentage += Math.random() * 5;
                if (model.percentage > 100) model.percentage = 100;
                
                // Trigger UI update with overall progress
                if (this.onProgressUpdate) {
                    // Calculate overall progress from all models
                    const allProgress = Object.values(this.modelProgress);
                    const overallProgress = allProgress.reduce((sum, m) => sum + m.percentage, 0) / allProgress.length;
                    
                    this.onProgressUpdate({
                        percentage: overallProgress,
                        status: 'training',
                        modelType: modelType,
                        modelProgress: model.percentage
                    });
                }
            } else {
                model.status = 'completed';
                clearInterval(interval);
                
                // Trigger final UI update
                if (this.onProgressUpdate) {
                    const allProgress = Object.values(this.modelProgress);
                    const overallProgress = allProgress.reduce((sum, m) => sum + m.percentage, 0) / allProgress.length;
                    
                    this.onProgressUpdate({
                        percentage: overallProgress,
                        status: 'completed',
                        modelType: modelType,
                        modelProgress: model.percentage
                    });
                }
            }
        }, 300);
    }

    /**
     * Stop tracking progress
     */
    stopTracking() {
        if (this.interval) clearInterval(this.interval);
        this.progress.status = 'idle';
        this.progress.percentage = 0;
        this.progress.sessionId = null;
    }

    /**
     * Stop tracking a specific model
     */
    stopModelTracking(modelType) {
        if (this.modelProgress[modelType]) {
            this.modelProgress[modelType] = {
                percentage: 0,
                status: 'idle'
            };
        }
    }

    /**
     * Get current progress
     */
    getCurrentProgress() {
        return this.progress;
    }

    /**
     * Get progress for a specific model type
     */
    getProgress(modelType) {
        if (this.modelProgress[modelType]) {
            return this.modelProgress[modelType].percentage;
        }
        return 0;
    }

    /**
     * Get all model progress
     */
    getAllModelProgress() {
        return this.modelProgress;
    }

    /**
     * Reset all progress
     */
    resetProgress() {
        this.stopTracking();
        Object.keys(this.modelProgress).forEach(modelType => {
            this.stopModelTracking(modelType);
        });
    }

    /**
     * Cleanup resources
     */
    async cleanup() {
        this.stopTracking();
        console.log('🧹 Training Progress Tracker cleanup completed');
    }
}

// Export singleton instance
export const trainingProgressTracker = new TrainingProgressTracker(); 