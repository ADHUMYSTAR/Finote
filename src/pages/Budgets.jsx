import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import BudgetCard from '../components/BudgetCard.jsx';
import BudgetForm from '../components/BudgetForm.jsx';
import { budgetsAPI } from '../services/api.js';
import { Plus } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await budgetsAPI.getAll();
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (data) => {
    try {
      await budgetsAPI.create(data);
      fetchBudgets();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleUpdateBudget = async (data) => {
    try {
      await budgetsAPI.update(editingBudget._id, data);
      setEditingBudget(null);
      fetchBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetsAPI.delete(id);
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading budgets...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fade-in">
        <div className="flex justify-between items-center mb-3">
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)' }}>
            Budgets
          </h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Budget
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="card text-center">
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', margin: '2rem 0' }}>
              No budgets created yet. Start by adding your first budget!
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Add Your First Budget
            </button>
          </div>
        ) : (
          <div className="budget-grid">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                onEdit={(budget) => {
                  setEditingBudget(budget);
                  setIsFormOpen(true);
                }}
                onDelete={handleDeleteBudget}
              />
            ))}
          </div>
        )}

        <BudgetForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBudget(null);
          }}
          onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
          budget={editingBudget}
        />
      </div>
    </Layout>
  );
};

export default Budgets;