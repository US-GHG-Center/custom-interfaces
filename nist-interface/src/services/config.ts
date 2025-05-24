import { NistInterfaceConfig } from "../pages/nistInterface/types";

/**
 * Default configuration for the EMIT Interface
 * These values will be used if no user configuration is provided
 */
const defaultConfig: NistInterfaceConfig = {
  // API Endpoints
  mapboxToken:
    "pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA",
  mapboxStyle: "mapbox://styles/covid-nasa",
  basemapStyle: "cldu1cb8f00ds01p6gi583w1m",
  publicUrl: "/ghgcenter/custom-interfaces/emit-plume-viewer-test",
  featuresApiUrl: "https://earth.gov/ghgcenter/api/features/",
};

/**
 * Merges user configuration with default configuration
 * @param {Partial<EmitInterfaceConfig>} userConfig - User provided configuration
 * @returns {EmitInterfaceConfig} Merged configuration
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
 * @param {EmitInterfaceConfig} config - Configuration to validate
 * @returns {ValidationResult} Validation result with missing fields if any
 */
export const validateConfig = (
  config: NistInterfaceConfig
): ValidationResult => {
  const requiredFields: (keyof NistInterfaceConfig)[] = ["featuresApiUrl"];

  const missingFields = requiredFields.filter((field) => !config[field]);

  if (missingFields.length > 0) {
    return { result: false, missingFields };
  }
  return { result: true, missingFields: [] };
};
