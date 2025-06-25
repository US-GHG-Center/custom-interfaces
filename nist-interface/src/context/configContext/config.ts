import { NistInterfaceConfig } from "../../pages/nistInterface/types";

/**
 * Default configuration for the NIST Interface
 * These values will be used if no user configuration is provided
 */
const defaultConfig: NistInterfaceConfig = {
  mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN || "",
  mapboxStyle: process.env.REACT_APP_MAPBOX_STYLE_URL || "",
  featuresApiUrl: process.env.REACT_APP_FEATURES_API_URL || "",
  basemapStyle:
    process.env.REACT_APP_BASEMAP_STYLES_MAPBOX_ID ||
    "cldu1cb8f00ds01p6gi583w1m",
};
/**
 * Merges user configuration with default configuration
 * @param {Partial<NistInterfaceConfig>} userConfig - User provided configuration
 * @returns {NistInterfaceConfig} Merged configuration
 */
export const getConfig = (
  userConfig: Partial<NistInterfaceConfig> = {}
): NistInterfaceConfig => {
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
 * @param {NistInterfaceConfig} config - Configuration to validate
 * @returns {ValidationResult} Validation result with missing fields if any
 */
export const validateConfig = (
  config: NistInterfaceConfig
): ValidationResult => {
  const requiredFields: (keyof NistInterfaceConfig)[] = [
    "featuresApiUrl",
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
