import express from 'express';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all transactions for user
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, dateFrom, dateTo, limit = 50, page = 1 } = req.query;
    
    const filter = { user: req.user._id };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const { amount, type, category, note, date } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      amount,
      type,
      category,
      note,
      date: date || new Date()
    });

    await transaction.save();

    // Update budget spending if it's an expense
    if (type === 'expense') {
      const month = new Date(date || new Date()).toISOString().slice(0, 7);
      await Budget.findOneAndUpdate(
        { user: req.user._id, category, month },
        { $inc: { spent: amount } }
      );
    }

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, type, category, note, date } = req.body;
    
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update budget spending
    if (transaction.type === 'expense') {
      const oldMonth = new Date(transaction.date).toISOString().slice(0, 7);
      await Budget.findOneAndUpdate(
        { user: req.user._id, category: transaction.category, month: oldMonth },
        { $inc: { spent: -transaction.amount } }
      );
    }

    // Update transaction
    transaction.amount = amount;
    transaction.type = type;
    transaction.category = category;
    transaction.note = note;
    transaction.date = date || transaction.date;

    await transaction.save();

    // Update budget with new spending
    if (type === 'expense') {
      const newMonth = new Date(date || transaction.date).toISOString().slice(0, 7);
      await Budget.findOneAndUpdate(
        { user: req.user._id, category, month: newMonth },
        { $inc: { spent: amount } }
      );
    }

    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update budget spending
    if (transaction.type === 'expense') {
      const month = new Date(transaction.date).toISOString().slice(0, 7);
      await Budget.findOneAndUpdate(
        { user: req.user._id, category: transaction.category, month },
        { $inc: { spent: -transaction.amount } }
      );
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const stats = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'income') {
        result.totalIncome = stat.total;
      } else {
        result.totalExpenses = stat.total;
      }
      result.transactionCount += stat.count;
    });

    result.balance = result.totalIncome - result.totalExpenses;

    res.json(result);
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;