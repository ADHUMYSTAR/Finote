import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Target, TrendingUp } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>
          <TrendingUp size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Finote
        </h1>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;