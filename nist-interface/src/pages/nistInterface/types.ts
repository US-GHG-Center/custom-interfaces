export interface NistInterfaceConfig {
  mapboxToken: string;
  mapboxStyle: string;
  basemapStyle: string;
  featuresApiUrl: string;
}

export interface NistInterface {
  config?: Partial<NistInterfaceConfig>;
  defaultZoomLevel: number;
  agency?: string;
  dataCategory?: string;
  region?: string;
  ghg?: string;
  stationCode?: string;
}
