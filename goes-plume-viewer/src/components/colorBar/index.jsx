import { useEffect, useRef } from "react";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { createColorbar } from "./helper";
import * as d3 from "d3";

import "./index.css";

export const ColorBar = () => {
    const colorBarScale = useRef();

    useEffect(() => {
        const colorbar = d3.select(colorBarScale.current);
        createColorbar(colorbar);

        return () => {
            colorbar.selectAll("*").remove();
        }
    }, []);

    return (
        <Card id="colorbar">
            <div ref={colorBarScale} className="colorbar-scale"></div>
            <Typography variant="subtitle2" gutterBottom sx={{ marginBottom: 0 }} className="colorbar-label">
                Methane Column Enhancement (mol/m²)
            </Typography>
        </Card>
    )
}
