import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const spent = budget.spent || 0;
  const percentage = Math.min((spent / budget.amount) * 100, 100);
  
  const getProgressColor = () => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  return (
    <div className="budget-card">
      <div className="budget-header">
        <h3 className="budget-category">{budget.category}</h3>
        <div className="card-actions">
          <button onClick={() => onEdit(budget)} className="btn btn-secondary btn-small">
            <Edit size={16} />
          </button>
          <button onClick={() => onDelete(budget._id)} className="btn btn-danger btn-small">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="budget-amount">
        ₹{budget.amount.toLocaleString()}
      </div>
      
      <div className="budget-progress">
        <div className="budget-progress-text">
          <span>₹{spent.toLocaleString()} spent</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;