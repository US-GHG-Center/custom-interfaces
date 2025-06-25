export interface NistInterfaceConfig {
  mapboxToken: string;
  mapboxStyle: string;
  basemapStyle: string;
  featuresApiUrl: string;
}

export interface NistInterface {
  config?: Partial<NistInterfaceConfig>;
  defaultZoomLevel: number;
}
