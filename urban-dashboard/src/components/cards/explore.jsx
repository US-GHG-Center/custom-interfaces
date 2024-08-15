import * as React from "react";
import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
// import Link from '@mui/material/Link';
import { Link } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import './index.css';

export function ExploreMoreCard({description, link}) {
  return (
    <Card sx={{ maxWidth: 345 }} className="card">
            <Link to={link} className="explore-more-card">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <BarChartIcon style={{ marginRight: "10px"}}/>
                    <Typography variant="body2" component="text.primary" style={{ marginRight: "10px"}}>
                        {description}
                    </Typography>
                </div>
                <OpenInNewIcon/>
            </Link>
    </Card>
  );
}

ExploreMoreCard.propTypes = {
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
}