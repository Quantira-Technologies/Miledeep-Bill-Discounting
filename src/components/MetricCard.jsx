import React from 'react';

const MetricCard = ({ label, value, subtext }) => {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <div className="metric-value">{value}</div>
      <span className="metric-sub">{subtext}</span>
    </div>
  );
};

export default MetricCard;
