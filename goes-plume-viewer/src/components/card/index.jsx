import { useEffect, useState } from 'react';
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

// const HighlightableCard = styled(Card)
// .attrs(props => ({
//     type: "boolean",
//     ishovered: props.isHovered
// }))
const HighlightableCard = styled(Card)
`
    transition: border 0.3s ease;
    &:hover {
        border: 1px solid blue;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    border: ${props => props.$isHovered ? "1px solid blue" : "1px solid transparent"};
    box-shadow: ${props => props.$isHovered ? "0 4px 20px rgba(0, 0, 0, 0.2)" : "none"};
`;

const CaptionValue = ({ caption, value, className }) => {
    return (
        <div className={className}>
            <Typography
                variant="caption"
                component="div"
                sx={{ color: 'text.primary' }}
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

export function PlumeCard({ plumeSourceId, plumeSourceName, startDatetime, endDatetime, imageUrl, tiffUrl, lon, lat, totalReleaseMass, colEnhancements, handleSelectedPlumeCard, hoveredPlumeId, setHoveredPlumeId }) {
    const [ isHovered, setIsHovered ] = useState(false);

    const handleCardClick = () => {
        handleSelectedPlumeCard(plumeSourceId);
    }

    const handleMouseEnter = () => {
        setHoveredPlumeId(plumeSourceId);
    }

    const handleMouseLeave = () => {
        setHoveredPlumeId("");
    }

    useEffect(() => {
        if (hoveredPlumeId === plumeSourceId) setIsHovered(true);
        if (hoveredPlumeId !== plumeSourceId) setIsHovered(false);
    }, [hoveredPlumeId, plumeSourceId])

    return (
    <HighlightableCard
        sx={{ display: 'flex', flex: '0 0 auto', margin: '15px' }}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        $isHovered={isHovered}
    >
        <div
            style={{display: "flex", alignItems: "center", justifyContent: "center"}}
        >
            <CardMedia
                component="img"
                height="100"
                sx={{ padding: "1em", objectFit: "contain" }}
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
                    caption = "Approximate Start time"
                    value = { startDatetime + " UTC" }
                />
                <CaptionValue
                    className="card-plume"
                    caption = "Approximate End time"
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
    </HighlightableCard>
  );
}
