import React from "react";
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { RootCard } from "./root";
import { OutlinedCard } from "./outlinedCard";

import { meta } from "../../assets/data/metadata";
const { landCoverageData } = meta;
const { area, coverage } = landCoverageData;

export function LandCoverageCard () {
    const description = "";

    return (
        <OutlinedCard>
            <RootCard title="Land Coverage" description={description} subDescription={`Total Area: ${area} km2`} className="card">
                <CardContent>
                    <Typography variant="h4">
                        {Math.trunc(coverage/area * 100)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        of the land area is covered by the population.
                    </Typography>
                </CardContent>
            </RootCard>
        </OutlinedCard>
    );
}