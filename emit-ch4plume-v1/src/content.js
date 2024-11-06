export const getPopupContent = (location, utcTimeObserved) => {
    return `
        <table style="line-height: 1.4; font-size: 12px;">
            <tr><td><strong>Location:</strong></td><td>${location}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${utcTimeObserved}</td></tr>
        </table>
    `;
};

//content.js (or within index.js)
export const createItemContent = (marker, properties, endpoint) => {
    // Round latitude and longitude to 2 decimal places
    const latitude = parseFloat(properties['Latitude of max concentration']).toFixed(2);
    const longitude = parseFloat(properties['Longitude of max concentration']).toFixed(2);

    return `
        <img src="${endpoint}" alt="Thumbnail"/>
        <strong>ID:</strong> ${marker.id}<br>
        <strong>UTC Time Observed:</strong> ${properties['UTC Time Observed']}<br>
        <strong>Location:</strong> ${properties['Location']}<br>
        <strong>Data Download:</strong> <a href="${properties['Data Download']}" target="_blank">Download</a><br>
        <strong>Max Plume Concentration:</strong> ${properties['Max Plume Concentration (ppm m)']} ppm m<br>
        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
            <div><strong>Latitude (Max conc):</strong> ${latitude}</div>
            <div><strong>Longitude (Max conc):</strong> ${longitude}</div>
        </div>
    `;
};



