/**
 * Updates the visibility of zoom instructions.
 * If zoomed, the instructions are hidden.
 * @returns {void}
 */
export function updateZoomInstructions() {
    const zoomInstructions = document.getElementById("zoom-instructions");
    if (zoomInstructions) {
        zoomInstructions.style.display = "none"; // Show instructions when not zoomed
    }
}

/**
 * Sets event listeners for displaying and hiding zoom instructions when hovering over the info circle.
 * @returns {void}
 */
export function setZoomInstructionEvents () {
    let infoCircle = document.getElementById("zoom-instruction-info-circle");
    const zoomInstructions = document.getElementById("zoom-instructions");
    
    if (zoomInstructions) {
        zoomInstructions.style.display = "block"; // Show instructions when not zoomed
    }

    infoCircle.addEventListener("mouseenter", () => {
        zoomInstructions.style.display = "block";
    });

    infoCircle.addEventListener("mouseleave", () => {
        zoomInstructions.style.display = "none";
    });

    infoCircle.addEventListener("click", () => {
        zoomInstructions.style.display = "none";
    });
}