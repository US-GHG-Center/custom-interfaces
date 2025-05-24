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
   * The STAC collection ID to fetch data from
   */
  collection?: string;

  /**
   * Initial zoom location [longitude, latitude]
   */
  defaultZoomLocation?: [number, number];

  /**
   * Initial zoom level
   */
  defaultZoomLevel?: number;

  /**
   * Configuration object for API endpoints and other settings
   */
  config?: Partial<GoesInterfaceConfig>;
}
