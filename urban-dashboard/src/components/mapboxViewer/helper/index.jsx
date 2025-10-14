
export const BASEMAP_STYLES = [
  {
    id: 'satellite',
    label: 'Satellite',
    mapboxId: 'cldu1cb8f00ds01p6gi583w1m',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/covid-nasa/cldu1cb8f00ds01p6gi583w1m/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'dark',
    label: 'Default dark',
    mapboxId: 'cldu14gii006801mgq3dn1jpd',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'light',
    label: 'Default light',
    mapboxId: 'cldu0tceb000701qnrl7p9woh',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'topo',
    label: 'Topo',
    mapboxId: 'cldu1yayu00au01qqrbdahb3m',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/covid-nasa/cldu1yayu00au01qqrbdahb3m/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  }
];

export const BASEMAP_ID_DEFAULT = 'satellite';

// export const VULCAN_RASTER_URL = "https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA"
// export const GRA2PES_RASTER_URL = "https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA";
export const VULCAN_RASTER_URL = "https://earth.gov/ghgcenter/api/raster/searches/dc3da6e6c0b1a2e941713c1c5932cb84/tiles/WebMercatorQuad/{z}/{x}/{y}?assets=total-co2&colormap_name=spectral_r&rescale=0%2C4000"
export const GRA2PES_RASTER_URL = "https://earth.gov/ghgcenter/api/raster/searches/50ad78abf9e9c642971cdce22ef8baf0/tiles/WebMercatorQuad/{z}/{x}/{y}?assets=co2&colormap_name=spectral_r&rescale=0%2C2000"


// Define bounds for different areas of interest
export const AOI_BOUNDS = {
  CONUS: {
    southwest: [-125.0, 24.0], // [lng, lat]
    northeast: [-66.0, 49.0],
  },
  US: {
    southwest: [-180.0, 18.0], // [lng, lat] - includes Hawaii and Alaska
    northeast: [-66.0, 72.0],
  },
  Alabama: { southwest: [-88.5, 30.2], northeast: [-84.9, 35.0] },
  Alaska: { southwest: [-179.1, 51.2], northeast: [179.9, 71.5] },
  Arizona: { southwest: [-114.8, 31.3], northeast: [-109.0, 37.0] },
  Arkansas: { southwest: [-94.6, 33.0], northeast: [-89.6, 36.5] },
  California: { southwest: [-124.5, 32.5], northeast: [-114.0, 42.0] },
  Colorado: { southwest: [-109.1, 36.9], northeast: [-102.0, 41.0] },
  Connecticut: { southwest: [-73.7, 40.9], northeast: [-71.8, 42.0] },
  Delaware: { southwest: [-75.8, 38.5], northeast: [-75.0, 39.8] },
  Florida: { southwest: [-87.6, 24.4], northeast: [-80.0, 31.0] },
  Georgia: { southwest: [-85.6, 30.3], northeast: [-80.8, 35.0] },
  Hawaii: { southwest: [-160.3, 18.9], northeast: [-154.8, 22.2] },
  Idaho: { southwest: [-117.2, 42.0], northeast: [-111.0, 49.0] },
  Illinois: { southwest: [-91.5, 36.9], northeast: [-87.0, 42.5] },
  Indiana: { southwest: [-88.1, 37.7], northeast: [-84.8, 41.8] },
  Iowa: { southwest: [-96.6, 40.4], northeast: [-90.1, 43.5] },
  Kansas: { southwest: [-102.1, 36.9], northeast: [-94.6, 40.0] },
  Kentucky: { southwest: [-89.6, 36.5], northeast: [-81.9, 39.1] },
  Louisiana: { southwest: [-94.0, 28.9], northeast: [-88.8, 33.0] },
  Maine: { southwest: [-71.1, 43.0], northeast: [-66.9, 47.5] },
  Maryland: { southwest: [-79.5, 37.9], northeast: [-75.0, 39.7] },
  Massachusetts: { southwest: [-73.5, 41.2], northeast: [-69.9, 42.9] },
  Michigan: { southwest: [-90.4, 41.7], northeast: [-82.4, 48.3] },
  Minnesota: { southwest: [-97.3, 43.5], northeast: [-89.5, 49.4] },
  Mississippi: { southwest: [-91.7, 30.2], northeast: [-88.1, 34.9] },
  Missouri: { southwest: [-95.8, 35.9], northeast: [-89.0, 40.6] },
  Montana: { southwest: [-116.1, 44.4], northeast: [-104.0, 49.0] },
  Nebraska: { southwest: [-104.1, 40.0], northeast: [-95.3, 43.0] },
  Nevada: { southwest: [-120.0, 35.0], northeast: [-114.0, 42.0] },
  'New Hampshire': { southwest: [-72.6, 42.7], northeast: [-70.6, 45.3] },
  'New Jersey': { southwest: [-75.6, 38.9], northeast: [-73.9, 41.4] },
  'New Mexico': { southwest: [-109.1, 31.3], northeast: [-103.0, 37.0] },
  'New York': { southwest: [-79.8, 40.5], northeast: [-71.8, 45.0] },
  'North Carolina': { southwest: [-84.3, 33.8], northeast: [-75.5, 36.6] },
  'North Dakota': { southwest: [-104.0, 45.9], northeast: [-96.5, 49.0] },
  Ohio: { southwest: [-84.8, 38.4], northeast: [-80.5, 41.9] },
  Oklahoma: { southwest: [-103.0, 33.6], northeast: [-94.4, 37.0] },
  Oregon: { southwest: [-124.6, 41.9], northeast: [-116.5, 46.3] },
  Pennsylvania: { southwest: [-80.5, 39.7], northeast: [-74.7, 42.3] },
  'Rhode Island': { southwest: [-71.9, 41.1], northeast: [-71.1, 42.0] },
  'South Carolina': { southwest: [-83.3, 32.0], northeast: [-78.5, 35.2] },
  'South Dakota': { southwest: [-104.1, 42.5], northeast: [-96.4, 45.9] },
  Tennessee: { southwest: [-90.3, 34.9], northeast: [-81.6, 36.7] },
  Texas: { southwest: [-106.6, 25.8], northeast: [-93.5, 36.5] },
  Utah: { southwest: [-114.1, 36.9], northeast: [-109.0, 42.0] },
  Vermont: { southwest: [-73.4, 42.7], northeast: [-71.5, 45.0] },
  Virginia: { southwest: [-83.7, 36.5], northeast: [-75.2, 39.5] },
  Washington: { southwest: [-124.8, 45.5], northeast: [-116.9, 49.0] },
  'West Virginia': { southwest: [-82.6, 37.2], northeast: [-77.7, 40.6] },
  Wisconsin: { southwest: [-92.9, 42.5], northeast: [-86.7, 47.3] },
  Wyoming: { southwest: [-111.1, 40.9], northeast: [-104.1, 45.0] },
};