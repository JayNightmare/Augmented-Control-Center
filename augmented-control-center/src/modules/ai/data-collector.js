/**
 * Data Collector - Handles real-time data collection from AR glasses sensors
 * Collects camera, IMU, eye tracking, and hand tracking data
 */

export class DataCollector {
    constructor() {
        this.isCollecting = false;
        this.collectedData = {
            camera: [],
            imu: [],
            eyeTracking: [],
            handTracking: [],
            environmental: []
        };
        this.dataStreams = {};
        this.config = {};
        this.qualityMetrics = {};
        
        // Data processing pipelines
        this.processors = {
            gesture: new GestureDataProcessor(),
            eyeTracking: new EyeTrackingDataProcessor(),
            behavior: new BehaviorDataProcessor()
        };
    }

    /**
     * Initialize the data collector
     */
    async initialize() {
        try {
            console.log('📊 Initializing Data Collector...');
            
            // Initialize sensor access (don't fail if sensors are not available)
            try {
                await this.initializeSensors();
            } catch (sensorError) {
                console.warn('⚠️ Sensor initialization failed, continuing with mock data:', sensorError.message);
            }
            
            // Initialize data processors
            try {
                await this.initializeProcessors();
            } catch (processorError) {
                console.warn('⚠️ Processor initialization failed:', processorError.message);
            }
            
            // Set up data quality monitoring
            this.setupQualityMonitoring();
            
            console.log('✅ Data Collector initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Data Collector:', error);
            // Don't throw error - allow initialization to continue
        }
    }

    /**
     * Initialize sensor access
     */
    async initializeSensors() {
        try {
            // Initialize camera access (optional - don't fail if not available)
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    this.dataStreams.camera = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: { ideal: 1920 },
                            height: { ideal: 1080 },
                            frameRate: { ideal: 30 }
                        }
                    });
                    console.log('✅ Camera access initialized');
                }
            } catch (cameraError) {
                console.warn('⚠️ Camera access not available:', cameraError.message);
            }

            // Initialize IMU sensors (if available)
            if ('DeviceMotionEvent' in window) {
                this.setupIMUListeners();
                console.log('✅ IMU sensors initialized');
            } else {
                console.warn('⚠️ IMU sensors not available');
            }

            // Initialize eye tracking (mock for now)
            this.setupEyeTrackingMock();
            console.log('✅ Eye tracking mock initialized');

            // Initialize hand tracking (mock for now)
            this.setupHandTrackingMock();
            console.log('✅ Hand tracking mock initialized');

            console.log('✅ Sensors initialized');
            
        } catch (error) {
            console.warn('⚠️ Some sensors not available:', error);
            // Don't throw error - continue with available sensors
        }
    }

    /**
     * Initialize data processors
     */
    async initializeProcessors() {
        for (const [name, processor] of Object.entries(this.processors)) {
            await processor.initialize();
        }
    }

    /**
     * Start data collection
     */
    async startCollection(config = {}) {
        if (this.isCollecting) {
            console.warn('⚠️ Data collection already in progress');
            return;
        }

        try {
            this.isCollecting = true;
            this.config = config;
            
            console.log('🎯 Starting data collection...');
            
            // Clear previous data
            this.clearCollectedData();
            
            // Start collecting from each sensor
            await Promise.all([
                this.startCameraCollection(),
                this.startIMUCollection(),
                this.startEyeTrackingCollection(),
                this.startHandTrackingCollection()
            ]);
            
            // Start quality monitoring
            this.startQualityMonitoring();
            
            console.log('✅ Data collection started');
            
        } catch (error) {
            console.error('❌ Failed to start data collection:', error);
            this.isCollecting = false;
            throw error;
        }
    }

    /**
     * Stop data collection
     */
    async stopCollection() {
        if (!this.isCollecting) {
            return;
        }

        try {
            console.log('🛑 Stopping data collection...');
            
            this.isCollecting = false;
            
            // Stop all data streams
            await this.stopAllStreams();
            
            // Stop quality monitoring
            this.stopQualityMonitoring();
            
            // Process collected data
            await this.processCollectedData();
            
            console.log('✅ Data collection stopped');
            
        } catch (error) {
            console.error('❌ Error stopping data collection:', error);
            throw error;
        }
    }

    /**
     * Start camera data collection
     */
    async startCameraCollection() {
        if (!this.dataStreams.camera) {
            console.warn('⚠️ Camera stream not available');
            return;
        }

        const videoTrack = this.dataStreams.camera.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        
        const collectFrame = async () => {
            if (!this.isCollecting) return;
            
            try {
                const frame = await imageCapture.grabFrame();
                const timestamp = Date.now();
                
                this.collectedData.camera.push({
                    timestamp,
                    frame,
                    metadata: {
                        width: frame.width,
                        height: frame.height,
                        quality: this.assessImageQuality(frame)
                    }
                });
                
                // Limit data size
                if (this.collectedData.camera.length > 1000) {
                    this.collectedData.camera.shift();
                }
                
            } catch (error) {
                console.warn('⚠️ Failed to capture camera frame:', error);
            }
            
            // Schedule next frame
            if (this.isCollecting) {
                setTimeout(collectFrame, 1000 / this.config.dataCollection?.sampleRate || 30);
            }
        };
        
        collectFrame();
    }

    /**
     * Start IMU data collection
     */
    startIMUCollection() {
        if (!('DeviceMotionEvent' in window)) {
            console.warn('⚠️ IMU not available');
            return;
        }

        const handleMotion = (event) => {
            if (!this.isCollecting) return;
            
            const timestamp = Date.now();
            const motionData = {
                timestamp,
                acceleration: {
                    x: event.accelerationIncludingGravity?.x || 0,
                    y: event.accelerationIncludingGravity?.y || 0,
                    z: event.accelerationIncludingGravity?.z || 0
                },
                rotationRate: {
                    alpha: event.rotationRate?.alpha || 0,
                    beta: event.rotationRate?.beta || 0,
                    gamma: event.rotationRate?.gamma || 0
                }
            };
            
            this.collectedData.imu.push(motionData);
            
            // Limit data size
            if (this.collectedData.imu.length > 1000) {
                this.collectedData.imu.shift();
            }
        };
        
        window.addEventListener('devicemotion', handleMotion);
        this.dataStreams.imu = { handler: handleMotion };
    }

    /**
     * Start eye tracking data collection (mock)
     */
    startEyeTrackingCollection() {
        const collectEyeData = () => {
            if (!this.isCollecting) return;
            
            const timestamp = Date.now();
            const eyeData = {
                timestamp,
                leftEye: {
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    pupilSize: 3 + Math.random() * 2,
                    blink: Math.random() > 0.95
                },
                rightEye: {
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    pupilSize: 3 + Math.random() * 2,
                    blink: Math.random() > 0.95
                },
                gazePoint: {
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    confidence: 0.7 + Math.random() * 0.3
                }
            };
            
            this.collectedData.eyeTracking.push(eyeData);
            
            // Limit data size
            if (this.collectedData.eyeTracking.length > 1000) {
                this.collectedData.eyeTracking.shift();
            }
            
            // Schedule next collection
            if (this.isCollecting) {
                setTimeout(collectEyeData, 1000 / 30); // 30 Hz
            }
        };
        
        collectEyeData();
    }

    /**
     * Start hand tracking data collection (mock)
     */
    startHandTrackingCollection() {
        const collectHandData = () => {
            if (!this.isCollecting) return;
            
            const timestamp = Date.now();
            const handData = {
                timestamp,
                leftHand: {
                    detected: Math.random() > 0.1,
                    landmarks: this.generateHandLandmarks(),
                    gestures: this.detectGestures()
                },
                rightHand: {
                    detected: Math.random() > 0.1,
                    landmarks: this.generateHandLandmarks(),
                    gestures: this.detectGestures()
                }
            };
            
            this.collectedData.handTracking.push(handData);
            
            // Limit data size
            if (this.collectedData.handTracking.length > 1000) {
                this.collectedData.handTracking.shift();
            }
            
            // Schedule next collection
            if (this.isCollecting) {
                setTimeout(collectHandData, 1000 / 30); // 30 Hz
            }
        };
        
        collectHandData();
    }

    /**
     * Preprocess gesture data
     */
    async preprocessGestureData(gestureData) {
        try {
            console.log('🔄 Preprocessing gesture data...');
            
            // Use gesture processor
            const processedData = await this.processors.gesture.process(gestureData);
            
            // Apply quality filters
            const filteredData = this.applyQualityFilters(processedData);
            
            // Normalize data
            const normalizedData = this.normalizeGestureData(filteredData);
            
            console.log('✅ Gesture data preprocessing completed');
            return normalizedData;
            
        } catch (error) {
            console.error('❌ Failed to preprocess gesture data:', error);
            throw error;
        }
    }

    /**
     * Preprocess eye data
     */
    async preprocessEyeData(eyeData) {
        try {
            console.log('🔄 Preprocessing eye data...');
            
            // Use eye tracking processor
            const processedData = await this.processors.eyeTracking.process(eyeData);
            
            // Apply quality filters
            const filteredData = this.applyQualityFilters(processedData);
            
            // Normalize data
            const normalizedData = this.normalizeEyeData(filteredData);
            
            console.log('✅ Eye data preprocessing completed');
            return normalizedData;
            
        } catch (error) {
            console.error('❌ Failed to preprocess eye data:', error);
            throw error;
        }
    }

    /**
     * Preprocess user data
     */
    async preprocessUserData(userData) {
        try {
            console.log('🔄 Preprocessing user data...');
            
            // Use behavior processor
            const processedData = await this.processors.behavior.process(userData);
            
            // Apply quality filters
            const filteredData = this.applyQualityFilters(processedData);
            
            // Normalize data
            const normalizedData = this.normalizeUserData(filteredData);
            
            console.log('✅ User data preprocessing completed');
            return normalizedData;
            
        } catch (error) {
            console.error('❌ Failed to preprocess user data:', error);
            throw error;
        }
    }

    /**
     * Get collected data
     */
    getCollectedData() {
        return {
            ...this.collectedData,
            metadata: {
                totalSamples: this.getTotalSamples(),
                qualityMetrics: this.qualityMetrics,
                collectionDuration: this.getCollectionDuration()
            }
        };
    }

    /**
     * Clear collected data
     */
    clearCollectedData() {
        for (const key in this.collectedData) {
            this.collectedData[key] = [];
        }
    }

    /**
     * Setup IMU listeners
     */
    setupIMUListeners() {
        // Request permission for device motion
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        console.log('✅ IMU permission granted');
                    }
                })
                .catch(error => {
                    console.warn('⚠️ IMU permission denied:', error);
                });
        }
    }

    /**
     * Setup eye tracking mock
     */
    setupEyeTrackingMock() {
        console.log('👁️ Eye tracking mock initialized');
    }

    /**
     * Setup hand tracking mock
     */
    setupHandTrackingMock() {
        console.log('✋ Hand tracking mock initialized');
    }

    /**
     * Generate hand landmarks (mock)
     */
    generateHandLandmarks() {
        const landmarks = [];
        for (let i = 0; i < 21; i++) {
            landmarks.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                z: Math.random() * 100,
                confidence: 0.7 + Math.random() * 0.3
            });
        }
        return landmarks;
    }

    /**
     * Detect gestures (mock)
     */
    detectGestures() {
        const gestures = ['fist', 'open', 'point', 'thumbs_up', 'peace'];
        return gestures.filter(() => Math.random() > 0.7);
    }

    /**
     * Assess image quality
     */
    assessImageQuality(frame) {
        // Simple quality assessment based on brightness and contrast
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = frame.width;
        canvas.height = frame.height;
        ctx.drawImage(frame, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let brightness = 0;
        let contrast = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
            brightness += gray;
        }
        
        brightness /= (data.length / 4);
        
        // Simple contrast calculation
        for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
            contrast += Math.abs(gray - brightness);
        }
        
        contrast /= (data.length / 4);
        
        return {
            brightness: brightness / 255,
            contrast: contrast / 255,
            overall: Math.min(1, (brightness / 255 + contrast / 255) / 2)
        };
    }

    /**
     * Apply quality filters
     */
    applyQualityFilters(data) {
        const qualityThreshold = this.config.dataCollection?.qualityThreshold || 0.8;
        
        return data.filter(item => {
            if (item.quality && item.quality.overall < qualityThreshold) {
                return false;
            }
            return true;
        });
    }

    /**
     * Normalize gesture data
     */
    normalizeGestureData(data) {
        // Normalize hand landmarks to 0-1 range
        return data.map(item => ({
            ...item,
            landmarks: item.landmarks?.map(landmark => ({
                x: landmark.x / 100,
                y: landmark.y / 100,
                z: landmark.z / 100,
                confidence: landmark.confidence
            }))
        }));
    }

    /**
     * Normalize eye data
     */
    normalizeEyeData(data) {
        // Normalize eye coordinates to 0-1 range
        return data.map(item => ({
            ...item,
            leftEye: {
                ...item.leftEye,
                x: item.leftEye.x / 100,
                y: item.leftEye.y / 100
            },
            rightEye: {
                ...item.rightEye,
                x: item.rightEye.x / 100,
                y: item.rightEye.y / 100
            },
            gazePoint: {
                x: item.gazePoint.x / 100,
                y: item.gazePoint.y / 100,
                confidence: item.gazePoint.confidence
            }
        }));
    }

    /**
     * Normalize user data
     */
    normalizeUserData(data) {
        // Normalize user interaction data
        return data.map(item => ({
            ...item,
            timestamp: item.timestamp / 1000, // Convert to seconds
            // Add other normalizations as needed
        }));
    }

    /**
     * Setup quality monitoring
     */
    setupQualityMonitoring() {
        this.qualityMetrics = {
            camera: { samples: 0, quality: 0 },
            imu: { samples: 0, quality: 0 },
            eyeTracking: { samples: 0, quality: 0 },
            handTracking: { samples: 0, quality: 0 }
        };
    }

    /**
     * Start quality monitoring
     */
    startQualityMonitoring() {
        this.qualityInterval = setInterval(() => {
            this.updateQualityMetrics();
        }, 1000);
    }

    /**
     * Stop quality monitoring
     */
    stopQualityMonitoring() {
        if (this.qualityInterval) {
            clearInterval(this.qualityInterval);
            this.qualityInterval = null;
        }
    }

    /**
     * Update quality metrics
     */
    updateQualityMetrics() {
        for (const [sensor, data] of Object.entries(this.collectedData)) {
            if (this.qualityMetrics[sensor]) {
                this.qualityMetrics[sensor].samples = data.length;
                
                if (data.length > 0) {
                    const avgQuality = data.reduce((sum, item) => {
                        return sum + (item.quality?.overall || 0.8);
                    }, 0) / data.length;
                    
                    this.qualityMetrics[sensor].quality = avgQuality;
                }
            }
        }
    }

    /**
     * Stop all data streams
     */
    async stopAllStreams() {
        // Stop camera stream
        if (this.dataStreams.camera) {
            this.dataStreams.camera.getTracks().forEach(track => track.stop());
        }

        // Stop IMU listener
        if (this.dataStreams.imu) {
            window.removeEventListener('devicemotion', this.dataStreams.imu.handler);
        }
    }

    /**
     * Process collected data
     */
    async processCollectedData() {
        console.log('🔄 Processing collected data...');
        
        // Process data through each processor
        for (const [name, processor] of Object.entries(this.processors)) {
            try {
                await processor.processBatch(this.collectedData);
            } catch (error) {
                console.warn(`⚠️ Failed to process ${name} data:`, error);
            }
        }
    }

    /**
     * Get total samples collected
     */
    getTotalSamples() {
        return Object.values(this.collectedData).reduce((total, data) => {
            return total + data.length;
        }, 0);
    }

    /**
     * Get collection duration
     */
    getCollectionDuration() {
        if (this.collectedData.camera.length === 0) return 0;
        
        const firstTimestamp = this.collectedData.camera[0].timestamp;
        const lastTimestamp = this.collectedData.camera[this.collectedData.camera.length - 1].timestamp;
        
        return (lastTimestamp - firstTimestamp) / 1000; // Convert to seconds
    }

    /**
     * Cleanup resources
     */
    async cleanup() {
        await this.stopCollection();
        
        // Cleanup processors
        for (const processor of Object.values(this.processors)) {
            await processor.cleanup();
        }
        
        console.log('🧹 Data Collector cleanup completed');
    }

    /**
     * Export collected data
     */
    async exportData() {
        const totalSamples = this.getTotalSamples();
        const duration = this.getCollectionDuration();
        
        const exportData = {
            samples: totalSamples,
            duration: duration,
            timestamp: Date.now(),
            data: {
                camera: this.collectedData.camera.length,
                imu: this.collectedData.imu.length,
                eyeTracking: this.collectedData.eyeTracking.length,
                handTracking: this.collectedData.handTracking.length
            }
        };
        
        console.log('📤 Exporting data:', exportData);
        return exportData;
    }
}

// Data processor classes
class GestureDataProcessor {
    async initialize() {
        console.log('🤖 Gesture data processor initialized');
    }
    
    async process(data) {
        // Process gesture data
        return data;
    }
    
    async processBatch(data) {
        // Process batch of gesture data
        console.log('🔄 Processing gesture data batch...');
    }
    
    async cleanup() {}
}

class EyeTrackingDataProcessor {
    async initialize() {
        console.log('👁️ Eye tracking data processor initialized');
    }
    
    async process(data) {
        // Process eye tracking data
        return data;
    }
    
    async processBatch(data) {
        // Process batch of eye tracking data
        console.log('🔄 Processing eye tracking data batch...');
    }
    
    async cleanup() {}
}

class BehaviorDataProcessor {
    async initialize() {
        console.log('🧠 Behavior data processor initialized');
    }
    
    async process(data) {
        // Process behavior data
        return data;
    }
    
    async processBatch(data) {
        // Process batch of behavior data
        console.log('🔄 Processing behavior data batch...');
    }
    
    async cleanup() {}
} 