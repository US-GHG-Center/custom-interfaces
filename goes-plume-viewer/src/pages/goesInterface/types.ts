export interface GoesInterfaceConfig {
  stacApiUrl: string;
  mapboxToken: string;
  mapboxStyle: string;
  rasterApiUrl: string;
  publicUrl: string;
  basemapStyle: string;
  defaultCollectionId: string;
  defaultZoomLocation: [number, number];
  defaultZoomLevel: number;
  cloudBrowseUrl: string;
}

export interface GoesInterface {
  /**
   * Configuration object for API endpoints and other settings
   */
  config?: Partial<GoesInterfaceConfig>;
}
