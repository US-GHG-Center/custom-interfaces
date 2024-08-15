import React from 'react';
import PropTypes from 'prop-types';

export function RightInsights(props) {
    return (
        <div className="insights-right">
            {props.children}
        </div>
    );
}

RightInsights.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element), 
      PropTypes.element.isRequired
    ])
}