import "./index.css";
import Typography from '@mui/material/Typography';

export function DatasetCard({ dataset }) {
    return (
        <>
            {dataset === "vulcan" && <VulcanDatasetCard />}
            {dataset === "gra2pes" && <Grap2pesDatasetCard />}
        </>
    )
}

export function Grap2pesDatasetCard() {
    const title = "GRA²PES";
    const description = "GRA²PES expands upon existing datasets to model and map greenhouse gases (Carbon Dioxide, Carbon Monoxide, Nitrogen Oxides) and hazardous air pollutants (Sulphur Dioxide, Particulate Matter) together, offering fine-resolution information about monthly emissions for multiple sectors."

    return (
        <div className="dataset-card">
            <Typography variant='h5' sx={{ mt: 1, mb: 1 }}>
                <span>{title}</span>
            </Typography>

            <p>
                {description}
                <a target="opener" href="https://earth.gov/ghgcenter/data-catalog/gra2pes-ghg-monthgrid-v1"> Click here for more details.</a>
            </p>
        </div>
    )
}

export function VulcanDatasetCard() {
    const title = "Vulcan v4.0"
    const description = "Providing annual carbon dioxide (CO₂) emissions estimates per one square kilometer for ten different sectors, the Vulcan dataset provides estimates of fossil fuel use and greenhouse gas emissions at the neighborhood scale."

    return (
        <div className="dataset-card">
            <Typography variant='h5' sx={{ mt: 1, mb: 1 }}>
                <span>{title}</span>
            </Typography>
            <p>
                {description}
                <a target="opener" href="https://earth.gov/ghgcenter/data-catalog/vulcan-ffco2-yeargrid-v4"> Click here for more details.</a>
            </p>
        </div>
    )
}
