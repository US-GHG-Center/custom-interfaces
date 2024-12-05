export const getPopupContent = (location, utcTimeObserved, id) => {
    return `
        <table style="line-height: 1.4; font-size: 11px;">
            <tr><td><strong>ID:</strong></td><td>${id}</td></tr>
            <tr><td><strong>Location:</strong></td><td>${location}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${utcTimeObserved}</td></tr>
        </table>
    `;
};

export const createItemContent = (marker, properties, endpoint) => {
    const latitude = parseFloat(properties['Latitude of max concentration']).toFixed(2);
    const longitude = parseFloat(properties['Longitude of max concentration']).toFixed(2);
    return `
    <div class="image-column">
        <img src="${endpoint}" alt="Thumbnail"/>
    </div>
    <div class="text-column">
        <div class="info-row">
            <div><strong class="props">ID:</strong> ${properties["Plume ID"]}</div>
            <div><strong class="props">Orbit:</strong> ${properties["Orbit"]}</div>
            
        </div>
        <div class="info-row"> <a href="${properties['Data Download']}" target="_blank">Download the TIF file <svg width="10" height="10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 16 16" aria-hidden="true" class="expand-top-right__CollecticonExpandTopRight-sc-1bjhv94-0">
        <title>expand top right icon</title>
        <path d="M3,5h4V3H1v12h12V9h-2v4H3V5z M16,8V0L8,0v2h4.587L6.294,8.294l1.413,1.413L14,3.413V8H16z"></path>
      </svg></a></div>  
        <hr class="separator">
        <div class="info-row">
            <div><strong class="props">Location:</strong> ${properties['Location']}</div>
            <div><strong class="props">UTC Time Observed:</strong> ${properties['UTC Time Observed']}</div>
            
        </div>
        <div class="info-row">
            <div><strong class="props">Max Plume Concentration:</strong> ${properties['Max Plume Concentration (ppm m)']} ppm m</div>
            <div><strong class="props">Concentration Uncertainity:</strong> ${properties['Concentration Uncertainty (ppm m)']} ppm m</div>
            
        </div>
        <div class="info-row">
            <div><strong class="props">Latitude (Max conc):</strong> ${latitude}</div>
            <div><strong class="props">Longitude (Max conc):</strong> ${longitude}</div>
        </div>
    </div>
    `;
};



