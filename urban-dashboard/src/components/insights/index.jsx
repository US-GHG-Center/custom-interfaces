import { LeftInsights } from "./helper/left";
import { RightInsights } from "./helper/right";
import './index.css';

import { PopulationCard } from "../cards/population";
import { TransportationCard } from "../cards/transportation";
import { LandCoverageCard } from "../cards/landCoverage";
import { AirQualityCard } from "../cards/defaultAir";
import { ExploreMoreCard } from "../cards/explore";

export function Insights({ urbanRegion }) {
    const towerDataViewerUrl = "/explore/tower";
    const airborneViewerUrl = "/explore/airborne";

    return (
        <div className="insights">
            <LeftInsights>
                <PopulationCard/>
                <TransportationCard/>
            </LeftInsights>
            <RightInsights>
                <LandCoverageCard/>
                <AirQualityCard/>
                <ExploreMoreCard description="Explore the Tower Data" link={towerDataViewerUrl}/>
                <ExploreMoreCard description="Explore the Airborne Data" link={airborneViewerUrl}/>
            </RightInsights>
        </div>
    );
}