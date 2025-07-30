export interface UrbanDashboardConfig {
  mapboxToken: string;
  mapboxStyle: string;
  basemapStyle: string;
  dataUrl: string;
}

export interface UrbanDashboard {
  config?: Partial<UrbanDashboardConfig>;
  defaultZoomLocation: [number, number];
  defaultZoomLevel: number;
}
