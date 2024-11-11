export const BASEMAP_STYLES = [
    {
      id: 'satellite',
      label: 'Satellite',
      mapboxId: 'cldu1cb8f00ds01p6gi583w1m',
      thumbnailUrl: `https://api.mapbox.com/styles/v1/covid-nasa/cldu1cb8f00ds01p6gi583w1m/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
    }
  ];

export const BASEMAP_ID_DEFAULT = 'satellite';
