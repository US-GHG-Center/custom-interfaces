export const FLASK = "flask";
export const PFP = "pfp";
export const INSITU = "insitu";
export const CH4 = "ch4";
export const CO2 = "co2";
export const SURFACE = "surface";
export const TOWER = "tower";
export const AIRCRAFT = "aircraft";
export const ghgBlue = "#082A63";


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