import { GoesInterfaceConfig } from "../../pages/goesInterface/types";

/**
 * Default configuration for the GOES Interface
 * These values will be used if no user configuration is provided
 */

const defaultConfig: GoesInterfaceConfig = {
  stacApiUrl: process.env.REACT_APP_STAC_API_URL || "",
  rasterApiUrl: process.env.REACT_APP_RASTER_API_URL || "",
  cloudBrowseUrl: process.env.REACT_APP_CLOUD_BROWSE_URL || "",
  mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN || "",
  mapboxStyle: process.env.REACT_APP_MAPBOX_STYLE_URL || "",
  basemapStyle: process.env.REACT_APP_BASEMAP_STYLES_MAPBOX_ID || "",
};

/**
 * Merges user configuration with default configuration
 * @param {Partial<GoesInterfaceConfig>} userConfig - User provided configuration
 * @returns {GoesInterfaceConfig} Merged configuration
 */
export const getConfig = (
  userConfig: Partial<GoesInterfaceConfig> = {}
): GoesInterfaceConfig => {
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
 * @param {GoesInterfaceConfig} config - Configuration to validate
 * @returns {ValidationResult} Validation result with missing fields if any
 */
export const validateConfig = (
  config: GoesInterfaceConfig
): ValidationResult => {
  const requiredFields: (keyof GoesInterfaceConfig)[] = [
    "stacApiUrl",
    "rasterApiUrl",
    "mapboxToken",
    "mapboxStyle",
    "basemapStyle",
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
