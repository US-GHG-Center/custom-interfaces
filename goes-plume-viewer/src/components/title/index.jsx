import { Paper, Typography } from "@mui/material";

import "./index.css";

export const Title = ({ children }) => {
    return (
        <Paper className="title-container">
            <Typography
                variant="h6"
                component="div"
                className="title-head"
            >
                GOES Methane Plume Viewer
            </Typography>
            <div className="title-content">
                { children }
            </div>
        </Paper>
    )
}
