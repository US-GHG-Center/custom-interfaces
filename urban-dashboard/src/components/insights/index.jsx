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
import { DatasetCard } from "../cards/dataset";

export function Insights({ urbanRegion, dataset }) {
    const towerDataViewerUrl = "/explore/tower";
    const airborneViewerUrl = "/explore/airborne";

    return (
        <div className="insights">
            <LeftInsights>
                <PopulationCard />

                {dataset === "gra2pes" && <GasEmissionsCard />}
                {dataset === "vulcan" && <SeasonalEmissionsCard />}
                {/* <TransportationCard /> */}
                {/* <div className="dataset-card">
                    <DatasetCard dataset={dataset} />
                </div> */}
            </LeftInsights >
            <BottomLeftInsights>
                <DatasetCard dataset={dataset} />
            </BottomLeftInsights>

            <RightInsights>
                {/* {dataset === "gra2pes" && <GasEmissionsCard />}
                {dataset === "vulcan" && <SeasonalEmissionsCard />} */}
                {/* <LandCoverageCard/> */}
                {/* <AirQualityCard /> */}
                {/* <ExploreMoreCard description="Explore the Tower Data" link={towerDataViewerUrl} /> */}
                {/* <ExploreMoreCard description="Explore the Airborne Data" link={airborneViewerUrl} /> */}
            </RightInsights>
        </div >
    );
}
