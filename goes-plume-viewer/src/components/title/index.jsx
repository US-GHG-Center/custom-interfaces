import { Paper, Typography } from "@mui/material";

import "./index.css";

export const Title = ({ children }) => {
    return (
        <Paper className="title-container">
            <Typography
                variant="h6"
                component="div"
                className="title-head"
                fontWeight="bold"
                sx={{margin: "0 0.9rem"}}
            >
                GOES Methane Plume Viewer
            </Typography>
            <Typography
                variant="body2"
                component="div"
                className="title-note"
                sx={{margin: "0 0.9rem", color: "text.secondary"}}
            >
                The Geostationary Operational Environmental Satellites collect images of the surface every 5 minutes. Only very large emission events can be detected, but plume expansion is easy to see over time. More plumes will be added soon.
            </Typography>
            <div className="title-content">
                { children }
            </div>
        </Paper>
    )
}
