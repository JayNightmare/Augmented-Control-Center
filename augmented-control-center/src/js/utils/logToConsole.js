export function logToConsole(message, type = "info", error = null) {
    const consoleOutput = document.getElementById("ai-console-output");
    if (!consoleOutput) return;

    const timestamp = new Date().toLocaleTimeString();
    let color = "#00ff00";
    let prefix = "ℹ️";

    switch (type) {
        case "error":
            color = "#ff0000";
            prefix = "❌";
            break;
        case "success":
            color = "#00ff00";
            prefix = "✅";
            break;
        case "warning":
            color = "#ffff00";
            prefix = "⚠️";
            break;
    }

    // Get file and line information
    let fileInfo = "";
    if (error && error.stack) {
        // Parse stack trace to get file and line
        const stackLines = error.stack.split("\n");
        for (const line of stackLines) {
            if (line.includes(".js:") && !line.includes("app.js")) {
                // Extract file name and line number
                const match = line.match(/([^/\\]+\.js):(\d+):(\d+)/);
                if (match) {
                    fileInfo = ` [${match[1]}:${match[2]}]`;
                    break;
                }
            }
        }
    } else {
        // Try to get caller information using Error stack
        try {
            const error = new Error();
            const stackLines = error.stack.split("\n");
            for (const line of stackLines) {
                if (
                    line.includes(".js:") &&
                    !line.includes("app.js") &&
                    !line.includes("logToConsole")
                ) {
                    const match = line.match(/([^/\\]+\.js):(\d+):(\d+)/);
                    if (match) {
                        fileInfo = ` [${match[1]}:${match[2]}]`;
                        break;
                    }
                }
            }
        } catch (e) {
            // Fallback if stack trace parsing fails
            fileInfo = "";
        }
    }

    const logEntry = document.createElement("div");
    logEntry.style.color = color;
    logEntry.innerHTML = `[${timestamp}] ${prefix} ${message}${fileInfo}`;

    consoleOutput.appendChild(logEntry);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;

    // Keep only last 50 entries
    while (consoleOutput.children.length > 50) {
        consoleOutput.removeChild(consoleOutput.firstChild);
    }
}
