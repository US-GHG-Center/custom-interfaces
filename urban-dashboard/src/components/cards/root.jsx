import * as React from "react";
import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";

import './index.css';

export function RootCard({ children, title, description, subDescription }) {
  return (
    <Card sx={{ maxWidth: 345 }} className="card">
      <CardHeader
        title={title}
        subheader={subDescription}
        sx={{marginBottom: 0}}
      />
      {children}
      {description &&
        <CardContent>
            <Typography variant="body2" color="text.secondary">
            {description}
            </Typography>
        </CardContent>
    }
    </Card>
  );
}

RootCard.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element.isRequired
    ]),
    title: PropTypes.string,
    description: PropTypes.string
}