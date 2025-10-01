import React from 'react';
import './UswdsBanner.css';

export function Banner({ text }) {
  return (
    <div className="uswds-banner">
      <div className="uswds-banner-inner">
        <p className="uswds-banner-text">{text}</p>
      </div>
    </div>
  );
}