import { CardContent, Typography } from "@mui/material";
import { OutlinedCard } from "./outlinedCard";
import { RootCard } from "./root";

//deprecated
export function DatasetCard({ dataset }) {
    let title = "";
    let description = ""

    if (dataset == "gra2pes") {
        title = "GRA2PES";
        description = "Monthly emission rates of greenhouse gases for ten different sectors, regridded to 0.1 x 0.1 degree resolution."
    } else if (dataset == "vulcan") {
        title = "Vulcan v4.0"
        description = "Provides annual CO2 emissions estimates for ten different sectors at 1km resolution. It is designed to be used as emission estimates in atmospheric transport modeling, policy, mapping, and other data analyses and applications."
    } else {
        console.error("dataset not found")
    }

    return (
        <OutlinedCard>
            <RootCard title={title}>
                <CardContent>
                    {description}
                </CardContent>
            </RootCard>
        </OutlinedCard>
    )
}

export function Grap2pesDatasetCard() {
    const title = "GRA2PES";
    const description = "Monthly emission rates of greenhouse gases for ten different sectors, regridded to 0.1 x 0.1 degree resolution."

    return (
        <OutlinedCard>
            <RootCard title={title}>
                <CardContent>
                    {description}
                </CardContent>
            </RootCard>
        </OutlinedCard>
    )
}

export function VulcanDatasetCard() {
    const title = "Vulcan v4.0"
    const description = "Provides annual CO2 emissions estimates for ten different sectors at 1km resolution. It is designed to be used as emission estimates in atmospheric transport modeling, policy, mapping, and other data analyses and applications."

    return (
        <OutlinedCard>
            <RootCard title={title}>
                <CardContent>
                    {description}
                </CardContent>
            </RootCard>
        </OutlinedCard>
    )

}
