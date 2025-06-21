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
     * Stop tracking progress
     */
    stopTracking() {
        if (this.interval) clearInterval(this.interval);
        this.progress.status = 'idle';
        this.progress.percentage = 0;
        this.progress.sessionId = null;
    }

    /**
     * Get current progress
     */
    getCurrentProgress() {
        return this.progress;
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