import express from 'express';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentYear = new Date().getFullYear();
    
    // Get current month's transactions
    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: new Date(currentMonth + '-01'),
            $lt: new Date(currentYear, new Date().getMonth() + 1, 1)
          }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get all-time stats
    const allTimeStats = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get budget status
    const budgets = await Budget.find({ user: req.user._id, month: currentMonth });
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

    const monthlyIncome = monthlyStats.find(s => s._id === 'income')?.total || 0;
    const monthlyExpenses = monthlyStats.find(s => s._id === 'expense')?.total || 0;
    const totalIncome = allTimeStats.find(s => s._id === 'income')?.total || 0;
    const totalExpenses = allTimeStats.find(s => s._id === 'expense')?.total || 0;

    res.json({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      budgetRemaining: totalBudget - totalSpent,
      budgetStatus: totalSpent <= totalBudget ? 'on-track' : 'over-budget',
      totalBudget,
      totalSpent
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chart data
router.get('/charts', auth, async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Get category breakdown for current month
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: {
            $gte: new Date(currentMonth + '-01'),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          }
        }
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          category: '$_id',
          amount: 1,
          _id: 0
        }
      },
      { $sort: { amount: -1 } }
    ]);

    // Get monthly trends (last 6 months)
    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: '%Y-%m', date: '$date' } },
            type: '$type'
          },
          amount: { $sum: '$amount' }
        }
      },
      {
        $project: {
          month: '$_id.month',
          type: '$_id.type',
          amount: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json({
      categoryBreakdown,
      monthlyTrends
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;