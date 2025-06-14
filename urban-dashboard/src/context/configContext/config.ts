import { UrbanDashboardConfig } from "./types";

/**
 * Default configuration for the Urban Interface
 * These values will be used if no user configuration is provided
 */

const defaultConfig: UrbanDashboardConfig = {
  stacApiUrl: process.env.REACT_APP_STAC_API_URL || "",
  rasterApiUrl: process.env.REACT_APP_RASTER_API_URL || "",
  publicUrl: process.env.PUBLIC_URL || "",
  mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN || "",
  mapboxStyle: process.env.REACT_APP_MAPBOX_STYLE_URL || "",
  featuresApiUrl: process.env.REACT_APP_FEATURES_API_URL || "",
  basemapStyle: process.env.REACT_APP_BASEMAP_STYLES_MAPBOX_ID || "",
  defaultZoomLocation: [-99.676392, 39.106667],
  defaultZoomLevel: 4,
};

/**
 * Merges user configuration with default configuration
 * @param {Partial<UrbanDashboardConfig>} userConfig - User provided configuration
 * @returns {UrbanDashboardConfig} Merged configuration
 */
export const getConfig = (
  userConfig: Partial<UrbanDashboardConfig> = {}
): UrbanDashboardConfig => {
  return {
    ...defaultConfig,
    ...userConfig,
  };
};

interface ValidationResult {
  result: boolean;
  missingFields: string[];
}

/**
 * Validates the configuration
 * @param {UrbanDashboardConfig} config - Configuration to validate
 * @returns {UrbanDashboardConfig} Validation result with missing fields if any
 */
export const validateConfig = (
  config: UrbanDashboardConfig
): ValidationResult => {
  const requiredFields: (keyof UrbanDashboardConfig)[] = [
    "stacApiUrl",
    "rasterApiUrl",
    "mapboxToken",
    "mapboxStyle",
    "basemapStyle",
    "featuresApiUrl",
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      config[field] === undefined ||
      config[field] === null ||
      config[field] === ""
  );

  if (missingFields.length > 0) {
    return { result: false, missingFields };
  }
  return { result: true, missingFields: [] };
};
