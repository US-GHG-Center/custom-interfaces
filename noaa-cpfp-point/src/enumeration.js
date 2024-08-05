// Instrument types
export const FLASK = "flask";
export const PFP = "pfp";
export const INSITU = "insitu";
// GHG
export const CH4 = "ch4";
export const CO2 = "co2";
// Medium
export const SURFACE = "surface";
export const TOWER = "tower";
export const AIRCRAFT = "aircraft";
// Frequency
export const CONTINUOUS = "continuous";
export const NON_CONTINIOUS = "non-continuous";
// WildCard
export const ALL = "all";
// for near realtime data
export const NRT = "nrt";

// Color defination
export const ghgBlue = "#082A63";

// For nomenclature/Naming

export const MEDIUM = {
  [SURFACE]: {
    short: SURFACE,
    long: "Surface"
  },
  [TOWER]: {
    short: TOWER,
    long: "Tower"
  },
  [AIRCRAFT]: {
    short: AIRCRAFT,
    long: "Aircraft"
  }
}

export const TYPES = {
  [FLASK]: {
  short: FLASK,
    long: "Flask"
  },
  [PFP]: {
    short: PFP,
    long: "PFP"
  },
  [INSITU]: {
    short: INSITU,
    long: "Insitu"
  }
}

export const GHG = {
  [CH4]: {
    short: "CH₄",
    long: "Methane",
    unit: "ppb"
  },
  [CO2]: {
    short: "CO₂",
    long: "Carbon Dioxide",
    unit: "ppm"
  }
}

export const FREQUENCY = {
  [CONTINUOUS]: {
    short: "continuous",
    long: "Continuous"
  },
  [NON_CONTINIOUS]: {
    short: "non-continuous",
    long: "Non Continuous"
  }
}