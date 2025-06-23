export function updateSystemMetrics() {
    // Simulate real-time system metrics
    const metrics = {
        cpu: Math.floor(Math.random() * 50) + 20,
        memory: Math.floor(Math.random() * 30) + 20,
        gpu: Math.floor(Math.random() * 40) + 20,
        network: Math.floor(Math.random() * 20) + 5,
    };

    // Update progress bars
    const progressBars = document.querySelectorAll(".progress-fill");
    progressBars.forEach((bar, index) => {
        const values = [
            metrics.cpu,
            metrics.memory,
            metrics.gpu,
            metrics.network,
        ];
        if (values[index]) {
            bar.style.width = `${values[index]}%`;
            const percentageElement = bar.parentElement.nextElementSibling;
            if (percentageElement) {
                percentageElement.textContent = `${values[index]}%`;
            }
        }
    });
}

export function updateSystemLogs(message, level) {
    // const logContainer = document.querySelector(".bg-gray-900.p-4.rounded.h-48");
    const logContainer = document.getElementById("system-log-container");

    if (logContainer) {
        const timestamp = new Date().toLocaleTimeString();

        const colorClass = level ===
        "INFO" ? "text-green-400" :
        level === "WARN" ? "text-yellow-400" :
        level === "ERROR" ? "text-red-400" :
        level === "OTHER" ? "text-blue-400" :
        "text-gray-400";

        const logEntry = document.createElement("div");
        logEntry.className = colorClass;
        logEntry.textContent = `[${timestamp}] ${level}: ${message}`;

        logContainer.appendChild(logEntry);
    }
}

// //

// Generate random log levels and messages
// * Replace with level to show the log level
const logLevels = ["INFO", "WARN", "ERROR"];

// Generate a random log level and message
// * Replace with 'message' to show the reason for the log
const logMessages = [
    "System check completed",
    "Memory usage normal",
    "Network connection stable",
    "Temperature within limits",
    "Background processes running",
];

const randomLevel =
    logLevels[Math.floor(Math.random() * logLevels.length)];
const randomMessage =
    logMessages[Math.floor(Math.random() * logMessages.length)];
const colorClass =
    randomLevel === "INFO"
        ? "text-green-400"
        : randomLevel === "WARN"
        ? "text-yellow-400"
        : "text-red-400";

const logEntry = document.createElement("div");
logEntry.className = colorClass;
logEntry.textContent = `[${timestamp}] ${randomLevel}: ${randomMessage}`;

logContainer.appendChild(logEntry);

// Keep only last 10 log entries
while (logContainer.children.length > 10) {
    logContainer.removeChild(logContainer.firstChild);
}

// Scroll to the bottom of the log container
logContainer.scrollTop = logContainer.scrollHeight;
