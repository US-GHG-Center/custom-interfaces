
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