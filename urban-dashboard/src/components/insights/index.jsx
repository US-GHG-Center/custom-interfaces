import { BottomLeftInsights, LeftInsights } from "./helper/left";
import { RightInsights } from "./helper/right";
import './index.css';

import { PopulationCard } from "../cards/population";
import { TransportationCard } from "../cards/transportation";
import { LandCoverageCard } from "../cards/landCoverage";
import { AirQualityCard } from "../cards/defaultAir";
import { ExploreMoreCard } from "../cards/explore";
import { GasEmissionsCard } from "../cards/gasEmissions";
import { SeasonalEmissionsCard } from "../cards/seasonalEmissions";
import { DatasetCard, Grap2pesDatasetCard, VulcanDatasetCard } from "../cards/dataset";

function Grap2pesInsights() {
    return (
        <div className="insights">
            <LeftInsights>
                <PopulationCard />
            </LeftInsights>

            <BottomLeftInsights>
                <Grap2pesDatasetCard />
            </BottomLeftInsights>

            <RightInsights>
                <GasEmissionsCard />
            </RightInsights>
        </div>
    )
}

function VulcanInsights() {
    return (
        <div className="insights">
            <LeftInsights>
                <PopulationCard />
            </LeftInsights>

            <BottomLeftInsights>
                <VulcanDatasetCard />
            </BottomLeftInsights>

            <RightInsights>
                <SeasonalEmissionsCard />
            </RightInsights>
        </div>
    )
}

export function Insights({ urbanRegion, dataset }) {
    const towerDataViewerUrl = "/explore/tower";
    const airborneViewerUrl = "/explore/airborne";

    return (
        <>
            {dataset == "gra2pes" && <Grap2pesInsights />}
            {dataset == "vulcan" && <VulcanInsights />}
        </>
    );
}


