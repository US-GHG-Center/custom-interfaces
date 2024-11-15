import { useEffect, useRef } from "react";
import Card from '@mui/material/Card';

import { createColorbar } from "./helper";
import * as d3 from "d3";

import "./index.css";

export const ColorBar = () => {
    const colorBarRef = useRef();
    useEffect(() => {
        const colorBarElement = d3.select(colorBarRef.current);
        createColorbar(colorBarElement);

        return () => {
            colorBarElement.selectAll("*").remove();
        }
    }, []);

    return (
        <Card ref={colorBarRef} id="colorbar">
        </Card>
    )
}
