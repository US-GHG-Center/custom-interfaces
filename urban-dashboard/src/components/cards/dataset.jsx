import { CardContent, Typography } from "@mui/material";
import { OutlinedCard } from "./outlinedCard";
import { RootCard } from "./root";

export function DatasetCard({ dataset }) {
    return (
        <>
            {dataset === "vulcan" && <VulcanDatasetCard />}
            {dataset === "gra2pes" && <Grap2pesDatasetCard />}
        </>
    )
}

export function Grap2pesDatasetCard() {
    const title = "GRA2PES";
    const description = "GRA2PES expands upon existing datasets to model and map greenhouse gases (Carbon Dioxide, Carbon Monoxide, Nitrous Oxides) and hazardous air pollutants (Sulphur Dioxide, Particulate Matter) together, offering fine-resolution information about monthly emissions for multiple sectors."

    return (
        <div className="dataset-card">
            <h2>{title}</h2>
            <p>
                {description}
                <a target="_blank" href="https://earth.gov/ghgcenter/data-catalog/gra2pes-co2-monthgrid-v1"> Click here for more details.</a>
            </p>
        </div>
    )
}

export function VulcanDatasetCard() {
    const title = "Vulcan v4.0"
    const description = "Providing annual carbon dioxide (CO2) emissions estimates per one square mile for ten different sectors, the Vulcan dataset enables researchers to estimate fossil fuel use and understand greenhouse gas emissions at neighborhood scale."

    return (
        <div className="dataset-card">
            <h2>{title}</h2>
            <p>
                {description}
                <a target="_blank" href="https://earth.gov/ghgcenter/data-catalog/vulcan-ffco2-yeargrid-v4"> Click here for more details.</a>
            </p>
        </div>
    )
}