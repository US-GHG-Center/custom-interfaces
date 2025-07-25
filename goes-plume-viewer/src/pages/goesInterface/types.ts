export interface GoesInterfaceConfig {
  stacApiUrl: string;
  mapboxToken: string;
  mapboxStyle: string;
  rasterApiUrl: string;
  basemapStyle: string;
  cloudBrowseUrl: string;
}

export interface GoesInterface {
  /**
   * Configuration object for API endpoints and other settings
   */
  config?: Partial<GoesInterfaceConfig>;
  defaultCollectionId: string;
  defaultZoomLocation: [number, number];
  defaultZoomLevel: number;
}
