import { useEffect, useState } from 'react';
import moment from "moment";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styled from "styled-components";
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';

import "./index.css";

const HorizontalLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
`;

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

const formatDuration = (duration) => {
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let result = "";
    if ( hours > 0 ) result += `${hours} hour `;
    if ( minutes > 0 ) result += `${minutes} minutes `;
    if ( seconds > 0 ) result += `${seconds} seconds`;

    return result;
}

export function PlumeCard({ plumeSourceId, plumeSourceName, startDatetime, endDatetime, duration, imageUrl, tiffUrl, lon, lat, totalReleaseMass, colEnhancements, handleSelectedPlumeCard, hoveredPlumeId, setHoveredPlumeId }) {
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
                sx={{ padding: "1em", objectFit: "contain", minWidth: "50px", imageRendering: "pixelated" }}
                image={imageUrl}
                alt="Plume image"
            />
        </div>

      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
            <HorizontalLayout>
                <CaptionValue
                    caption = "Plume ID"
                    value = {plumeSourceName}
                />
            </HorizontalLayout>
            <HorizontalLayout>
                <CaptionValue
                    className="card-plume"
                    caption = "Visualization Start time"
                    value = { moment.utc(startDatetime).format("MM/DD/YYYY, HH:mm:ss") + " UTC" }
                />
                <CaptionValue
                    className="card-plume"
                    caption = "Visualization End time"
                    value = { moment.utc(endDatetime).format("MM/DD/YYYY, HH:mm:ss") + " UTC" }
                />
            </HorizontalLayout>
            <HorizontalLayout>
                <CaptionValue
                    className="card-plume"
                    caption = "Approximate Release Duration from Start Time"
                    value = { formatDuration(moment.duration(duration)) }
                />
            </HorizontalLayout>
            <HorizontalLayout>
                <a href={tiffUrl} target='_blank' rel="noreferrer" className='card-download-link'>
                    <Typography
                        variant="caption"
                        component="div"
                    >
                        <div style={{display: "flex", justifyContent: "center"}}>
                            Download the Tiff File <DownloadIcon fontSize='small'/>
                        </div>
                    </Typography></a>
            </HorizontalLayout>
            <Divider></Divider>
            <HorizontalLayout>
                <CaptionValue
                    className="card-plume"
                    caption = "Approximate Total Release Mass"
                    value = {totalReleaseMass + (totalReleaseMass==="N/A" ? "" : " Metric Tonnes")}
                />
                <CaptionValue
                    className="card-plume"
                    caption = "Maximum Methane Column Enhancement"
                    value = {colEnhancements + " mol/m²"}
                />
            </HorizontalLayout>
            <HorizontalLayout>
                <CaptionValue
                    className="card-plume"
                    caption = "Approximate Release Longitude"
                    value = {Number(lon).toFixed(3)}
                />
                <CaptionValue
                    className="card-plume"
                    caption = "Approximate Release Latitude"
                    value = {Number(lat).toFixed(3)}
                />
            </HorizontalLayout>
        </CardContent>
      </Box>
    </HighlightableCard>
  );
}
