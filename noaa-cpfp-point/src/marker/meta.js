import { ALL, CONTINUOUS, FLASK, PFP, NON_CONTINIOUS, INSITU, SURFACE, TOWER, NRT } from "../enumeration";

export const legendsDictionary = {
    [CONTINUOUS]: {
        color: "blue",
        className: "marker marker-blue",
        text: "Surface and Tower In-situ"
    },
    [NON_CONTINIOUS]: {
        color: "gold",
        className: "marker marker-gold",
        text: "Flask and PFP"
    },
    [ALL]: {
        color: "blue",
        className: "marker marker-blue",
        text: "Flask, PFP and In-situ"
    },
    [FLASK]: {
        [SURFACE]: {
            color: "pink",
            className: "marker marker-pink",
            text: "Flask"
        }
    },
    [PFP]: {
        [SURFACE]: {
            color: "red",
            className: "marker marker-blue",
            text: "PFP"
        }
    },
    [INSITU]: {
        [SURFACE]: {
            color: "blue",
            className: "marker marker-blue",
            text: "Surface In-situ"
        },
        [TOWER]: {
            color: "purple",
            className: "marker marker-purple",
            text: "Tower In-situ"
        }
    },
    [NRT]: {
        color: "red",
        className: "marker marker-unique",
        text: "NRT (Near Real Time) Measurements"
    },
};