import { CardContent, Typography } from "@mui/material";
import { OutlinedCard } from "./outlinedCard";
import { RootCard } from "./root";

export function DatasetCard({ dataset }) {
    return (
        <>
            {dataset == "vulcan" && <VulcanDatasetCard />}
            {dataset == "gra2pes" && <Grap2pesDatasetCard />}
        </>
    )
}

export function Grap2pesDatasetCard() {
    const title = "GRA2PES";
    const description = "Monthly emission rates of greenhouse gases for ten different sectors, regridded to 0.1 x 0.1 degree resolution."

    return (
        <div className="dataset-card">
            <h2>{title}</h2>
            <p>
                {description}
                <a target="_blank" href="https://www.nist.gov/programs-projects/greenhouse-gas-and-air-pollutants-emissions-system-gra2pes"> Click here for more details.</a>
            </p>
        </div>
    )
}

export function VulcanDatasetCard() {
    const title = "Vulcan v4.0"
    const description = "Provides annual CO2 emissions estimates for ten different sectors at 1km resolution. It is designed to be used as emission estimates in atmospheric transport modeling, policy, mapping, and other data analyses and applications."

    return (
        <div className="dataset-card">
            <h2>{title}</h2>
            <p>
                {description}
                <a target="_blank" href="https://daac.ornl.gov/NACP/guides/Vulcan_V3_Annual_Emissions.html"> Click here for more details.</a>
            </p>
        </div>
    )
}