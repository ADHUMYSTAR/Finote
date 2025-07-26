import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import { dashboardAPI, transactionsAPI } from '../services/api.js';
import { DollarSign, TrendingUp, TrendingDown, Target, PieChart, BarChart3, Activity, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    budgetStatus: 'on-track'
  });
  const [chartData, setChartData] = useState({
    incomeVsExpenses: null,
    categoryBreakdown: null,
    monthlyTrends: null
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartRes, transactionsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getChartData(),
        transactionsAPI.getAll({ limit: 5 })
      ]);

      setStats(statsRes.data);
      setChartData(chartRes.data);
      setRecentTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const incomeVsExpensesData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [stats.totalIncome, stats.totalExpenses],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 3,
        hoverBackgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(239, 68, 68, 0.9)'
        ],
      },
    ],
  };

  const categoryData = {
    labels: chartData.categoryBreakdown?.map(item => item.category) || [],
    datasets: [
      {
        label: 'Spending (₹)',
        data: chartData.categoryBreakdown?.map(item => item.amount) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Monthly trends data
  const monthlyTrendsData = {
    labels: chartData.monthlyTrends?.map(item => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(item.month.split('-')[1]) - 1;
      return months[monthIndex];
    }).filter((month, index, arr) => arr.indexOf(month) === index) || [],
    datasets: [
      {
        label: 'Income',
        data: chartData.monthlyTrends?.filter(item => item.type === 'income').map(item => item.amount) || [],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Expenses',
        data: chartData.monthlyTrends?.filter(item => item.type === 'expense').map(item => item.amount) || [],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Weekly spending data (mock data for demonstration)
  const weeklySpendingData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Spending (₹)',
        data: [1200, 800, 1500, 900, 2000, 1800, 1100],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center p-5">
          <div className="loading pulse">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fade-in">
        {/* Enhanced Stats Grid */}
        <div className="stats-grid">
          <StatCard
            title="Total Income"
            value={stats.totalIncome}
            icon={TrendingUp}
            change={stats.incomeChange}
            changeType="positive"
          />
          <StatCard
            title="Total Expenses"
            value={stats.totalExpenses}
            icon={TrendingDown}
            change={stats.expenseChange}
            changeType="negative"
          />
          <StatCard
            title="Current Balance"
            value={stats.balance}
            icon={DollarSign}
            change={stats.balanceChange}
            changeType={stats.balance >= 0 ? 'positive' : 'negative'}
          />
          <StatCard
            title="Budget Status"
            value={stats.budgetRemaining}
            icon={Target}
            change={stats.budgetChange}
            changeType={stats.budgetStatus === 'on-track' ? 'positive' : 'negative'}
          />
        </div>

        {/* Main Charts Grid */}
        <div className="charts-grid">
          <ChartCard
            title="Monthly Trends"
            type="line"
            data={monthlyTrendsData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    usePointStyle: true,
                    padding: 20,
                  },
                },
              },
            }}
          />
          <ChartCard
            title="Spending by Category"
            type="pie"
            data={categoryData}
            options={{
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                  },
                },
              },
            }}
          />
        </div>

        {/* Extended Charts Grid */}
        <div className="charts-extended-grid">
          <ChartCard
            title="Income vs Expenses"
            type="bar"
            data={incomeVsExpensesData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
          <ChartCard
            title="Weekly Spending Pattern"
            type="bar"
            data={weeklySpendingData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>

        {/* Quick Stats Cards */}
        <div className="stats-grid mb-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Activity className="card-icon" />
                Transaction Activity
              </h3>
            </div>
            <div className="stat-value">{recentTransactions.length}</div>
            <div className="stat-label">Recent Transactions</div>
            <div className="stat-change positive">
              <TrendingUp size={16} />
              +12% from last week
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Calendar className="card-icon" />
                This Month
              </h3>
            </div>
            <div className="stat-value">₹{(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}</div>
            <div className="stat-label">Net Income</div>
            <div className={`stat-change ${(stats.monthlyIncome - stats.monthlyExpenses) >= 0 ? 'positive' : 'negative'}`}>
              {(stats.monthlyIncome - stats.monthlyExpenses) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(((stats.monthlyIncome - stats.monthlyExpenses) / stats.monthlyIncome * 100) || 0).toFixed(1)}%
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <PieChart className="card-icon" />
                Top Category
              </h3>
            </div>
            <div className="stat-value">
              {chartData.categoryBreakdown?.[0]?.category || 'N/A'}
            </div>
            <div className="stat-label">Highest Spending</div>
            <div className="stat-change negative">
              ₹{chartData.categoryBreakdown?.[0]?.amount?.toLocaleString() || 0}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <BarChart3 className="card-icon" />
                Savings Rate
              </h3>
            </div>
            <div className="stat-value">
              {stats.totalIncome > 0 ? ((stats.balance / stats.totalIncome) * 100).toFixed(1) : 0}%
            </div>
            <div className="stat-label">Of Total Income</div>
            <div className={`stat-change ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
              {stats.balance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {stats.balance >= 0 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Transactions</h3>
            <div className="flex gap-2">
              <span className="text-success">●</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                Last 5 transactions
              </span>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                    <td>
                      <span className="inline-block p-1 rounded text-xs font-weight-600" 
                            style={{ 
                              background: transaction.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: transaction.type === 'income' ? 'var(--success)' : 'var(--danger)'
                            }}>
                        {transaction.category}
                      </span>
                    </td>
                    <td>
                      <span className={`text-${transaction.type === 'income' ? 'success' : 'danger'} font-weight-600`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className={`font-weight-700 ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </td>
                    <td style={{ color: 'var(--text-light)', fontStyle: transaction.note ? 'normal' : 'italic' }}>
                      {transaction.note || 'No note'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;