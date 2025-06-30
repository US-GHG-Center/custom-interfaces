export interface UrbanDashboardConfig {
  mapboxToken: string;
  mapboxStyle: string;
  basemapStyle: string;
  featuresApiUrl: string;
  dataUrl: string;
}

export interface UrbanDashboard {
  config?: Partial<UrbanDashboardConfig>;
  defaultZoomLocation: [number, number];
  defaultZoomLevel: number;
}
