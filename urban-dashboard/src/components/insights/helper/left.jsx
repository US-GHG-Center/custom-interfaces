import React from 'react';
import PropTypes from 'prop-types';

export function LeftInsights(props) {
    return (
        <div className="insights-left">
            {props.children}
        </div>
    );
}

LeftInsights.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element), 
      PropTypes.element.isRequired
    ])
}