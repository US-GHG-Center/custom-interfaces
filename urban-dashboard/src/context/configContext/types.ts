export interface UrbanDashboardConfig {
  stacApiUrl: string;
  mapboxToken: string;
  mapboxStyle: string;
  rasterApiUrl: string;
  publicUrl: string;
  basemapStyle: string;
  defaultZoomLocation: [number, number];
  defaultZoomLevel: number;
  featuresApiUrl: string;
}

export interface UrbanDashboard {
  config?: Partial<UrbanDashboardConfig>;
}
