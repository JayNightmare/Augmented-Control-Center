export function updateTrainingProgressBars(progress = {}, status = {}) {
    const models = [
        { id: "gesture-recognition" },
        { id: "object-detection" },
        { id: "voice-recognition" },
    ];

    models.forEach((model) => {
        const progressBar = document.getElementById(`${model.id}-progress`);
        const progressBarText = document.getElementById(
            `${model.id}-progress-text`
        );
        const statusText = document.getElementById(`${model.id}-status`);

        if (progressBar && statusText) {
            // Get model-specific progress and status or use defaults
            const modelProgress = progress[model.id] || 0;
            const modelStatus = status[model.id] || "waiting";

            // Update progress bar width
            progressBar.style.width = `${modelProgress}%`;

            // Update status text and progress bar style based on status
            switch (modelStatus) {
                case "waiting":
                    statusText.textContent = "Waiting to start";
                    progressBarText.textContent = "0%";
                    progressBar.className = "bg-blue-600"; // Reset to default color
                    break;
                case "queued":
                    statusText.textContent = "Queued";
                    progressBarText.textContent = `${modelProgress}%`;
                    progressBar.className = "bg-yellow-600";
                    progressBar.style.width = `${modelProgress}%`;
                    break;
                case "in-progress":
                    statusText.textContent = "Training";
                    progressBarText.textContent = `${modelProgress}%`;
                    progressBar.className = "bg-blue-600";
                    progressBar.style.width = `${modelProgress}%`;
                    break;
                case "completed":
                    statusText.textContent = "Complete";
                    progressBarText.textContent = "100%";
                    progressBar.style.width = "100%";
                    progressBar.className = "bg-green-600";
                    break;
                case "failed":
                    statusText.textContent = "Failed";
                    progressBarText.textContent = "Error";
                    progressBar.style.width = "100%";
                    progressBar.className = "bg-red-600";
                    progressBar.style.width = `100%`;
                    break;
                default:
                    statusText.textContent = modelStatus; // Display custom status
                    progressBar.className = "bg-blue-600";
                    progressBar.style.width = `${modelProgress}%`;
            }
        }
    });
}
