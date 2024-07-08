const chartContainer = document.getElementById("chart-container");
const noticeContainer = document.getElementById("notice-container");
const noticeContent = document.getElementById("notice-content");
const mapContainer = document.getElementById("map-container");

export function openNotice(text) {
    // Add in notice text to the notice area
    noticeContent.innerText = text;
    // Show notice and make 4% height
    noticeContainer.style.height = "4%";
    noticeContainer.style.bottom = "0";
    noticeContainer.style.display = "block";

    // Show chart and take remaining height
    chartContainer.style.bottom = "4%";

    // make up space for the notice
    mapContainer.style.height = "46%";
}

export function closeNotice() {
    // Hide notice and make it 0 height
    noticeContainer.style.display = "none";

    // Show chart starting from the bottom
    chartContainer.style.bottom = "0";

    // take back the space used by the notice
    mapContainer.style.height = "50%";
}