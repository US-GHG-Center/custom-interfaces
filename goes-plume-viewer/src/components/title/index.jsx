import { Paper, Typography } from "@mui/material";

import "./index.css";

export const Title = ({ children }) => {
    return (
        <Paper className="title-container">
            <Typography
                variant="h6"
                component="div"
                sx={{ color: 'text.secondary' }}
                align="center"
                style={{ borderBottom: "2px solid #082A64", margin: "10px" }}
            >
                Methane Plume - Data Portal
            </Typography>
            { children }
        </Paper>
    )
}
