import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, changeType, icon: Icon }) => {
  return (
    <div className="stat-card">
      <div className="card-header">
        <div className="stat-label">{title}</div>
        {Icon && <Icon className="card-icon" />}
      </div>
      <div className="stat-value">₹{value?.toLocaleString()}</div>
      {change && (
        <div className={`stat-change ${changeType}`}>
          {changeType === 'positive' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}%
        </div>
      )}
    </div>
  );
};

export default StatCard;