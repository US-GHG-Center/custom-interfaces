export interface UrbanDashboardConfig {
  mapboxToken: string;
  mapboxStyle: string;
  publicUrl: string;
  basemapStyle: string;
  defaultZoomLocation: [number, number];
  defaultZoomLevel: number;
  featuresApiUrl: string;
}

export interface UrbanDashboard {
  config?: Partial<UrbanDashboardConfig>;
}
