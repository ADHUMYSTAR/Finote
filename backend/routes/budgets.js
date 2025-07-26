import express from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all budgets for user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id })
      .sort({ month: -1, category: 1 });

    // Calculate spent amounts for each budget
    for (let budget of budgets) {
      const startDate = new Date(budget.month + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            type: 'expense',
            category: budget.category,
            date: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      budget.spent = spent.length > 0 ? spent[0].total : 0;
      await budget.save();
    }

    res.json({ budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create budget
router.post('/', auth, async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category,
      month
    });

    if (existingBudget) {
      return res.status(400).json({ 
        message: 'Budget already exists for this category and month' 
      });
    }

    const budget = new Budget({
      user: req.user._id,
      category,
      amount,
      month
    });

    await budget.save();

    res.status(201).json({
      message: 'Budget created successfully',
      budget
    });
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const { category, amount, month } = req.body;
    
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Check if another budget exists for the new category and month
    if (category !== budget.category || month !== budget.month) {
      const existingBudget = await Budget.findOne({
        user: req.user._id,
        category,
        month,
        _id: { $ne: req.params.id }
      });

      if (existingBudget) {
        return res.status(400).json({ 
          message: 'Budget already exists for this category and month' 
        });
      }
    }

    budget.category = category;
    budget.amount = amount;
    budget.month = month;

    await budget.save();

    res.json({
      message: 'Budget updated successfully',
      budget
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;