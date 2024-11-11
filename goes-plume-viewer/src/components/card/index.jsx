import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styled from "styled-components";
import Divider from '@mui/material/Divider';


import "./index.css";

const HorizontalLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
`;

const CaptionValue = ({ caption, value, className }) => {
    return (
        <div className={className}>
            <Typography
                variant="caption"
                component="div"
                sx={{ color: 'text.secondary' }}
            >
                { caption }
            </Typography>
            <Typography
                variant="body2"
                component="div"
                sx={{ color: 'text.secondary' }}
            >
                { value }
            </Typography>
        </div>
    )
}

export function PlumeCard({ plumeSourceName, startDatetime, endDatetime, imageUrl, tiffUrl, lon, lat, totalReleaseMass, colEnhancements }) {
    return (
    <Card sx={{ display: 'flex', margin: '15px'}}>
        <div
            style={{display: "flex", alignItems: "center", justifyContent: "center"}}
        >
            <CardMedia
                component="img"
                sx={{ width: 100, height: 100 }}
                image={imageUrl}
                alt="Live from space album cover"
            />
        </div>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
            <HorizontalLayout>
                <CaptionValue
                    caption = "Plume Source Name"
                    value = {plumeSourceName}
                />
            </HorizontalLayout>
            <HorizontalLayout>
                <CaptionValue
                    className="card-plume"
                    caption = "Approx Start time"
                    value = { startDatetime + " UTC" }
                />
                <CaptionValue
                    className="card-plume"
                    caption = "Approx End time"
                    value = { endDatetime + " UTC" }
                />
            </HorizontalLayout>
            <HorizontalLayout>
                <a href={tiffUrl} target='_blank' rel="noreferrer">
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        Download the Tiff File
                    </Typography></a>
            </HorizontalLayout>
            <Divider></Divider>
            <HorizontalLayout>
                <CaptionValue
                    className="card-plume"
                    caption = "Total Release Mass"
                    value = {totalReleaseMass + " Metric Tonne"}
                />
                <CaptionValue
                    className="card-plume"
                    caption = "Methane Column Enhancement"
                    value = {colEnhancements + " mol m-2"}
                />
            </HorizontalLayout>
            <HorizontalLayout>
                <CaptionValue
                    className="card-plume"
                    caption = "Longitude"
                    value = {lon}
                />
                <CaptionValue
                    className="card-plume"
                    caption = "Latitude"
                    value = {lat}
                />
            </HorizontalLayout>
        </CardContent>
      </Box>
    </Card>
  );
}
