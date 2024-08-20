import { CardContent, Typography } from "@mui/material";
import { OutlinedCard } from "./outlinedCard";
import { RootCard } from "./root";

export function DatasetCard() {
    return (
        <OutlinedCard>
            <RootCard title="GRA2PES">
                <CardContent>
                    Monthly emission rates of greenhouse gases for ten different sectors, regridded to 0.1 x 0.1 degree resolution.
                </CardContent>
            </RootCard>
        </OutlinedCard>
    )
}
