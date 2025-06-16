const Expense = require("../models/Expense");

// GET /balances
exports.getBalances = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = {};

    for (const exp of expenses) {
      const splitAmount = exp.amount / exp.participants.length;

      exp.participants.forEach(p => {
        balances[p] = (balances[p] || 0) - splitAmount;
      });

      balances[exp.paid_by] = (balances[exp.paid_by] || 0) + exp.amount;
    }

    res.status(200).json({ success: true, data: balances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /people
exports.getPeople = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const peopleSet = new Set();

    expenses.forEach(exp => {
      peopleSet.add(exp.paid_by);
      exp.participants.forEach(p => peopleSet.add(p));
    });

    const people = Array.from(peopleSet);
    res.status(200).json({ success: true, data: people });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /settlements
exports.getSettlementSummary = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = {};

    for (const exp of expenses) {
      const splitAmount = exp.amount / exp.participants.length;
      exp.participants.forEach(p => {
        balances[p] = (balances[p] || 0) - splitAmount;
      });
      balances[exp.paid_by] = (balances[exp.paid_by] || 0) + exp.amount;
    }

    const creditors = [], debtors = [];

    for (let person in balances) {
      const rounded = Number(balances[person].toFixed(2));
      if (rounded > 0) creditors.push({ person, amount: rounded });
      else if (rounded < 0) debtors.push({ person, amount: -rounded });
    }

    // Greedy settlement
    const settlements = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amount, creditors[j].amount);
      settlements.push({
        from: debtors[i].person,
        to: creditors[j].person,
        amount: Number(pay.toFixed(2))
      });

      debtors[i].amount -= pay;
      creditors[j].amount -= pay;

      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    res.status(200).json({ success: true, data: settlements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategorySummary = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const summary = {};

    expenses.forEach(exp => {
      const cat = exp.category || "Other";
      summary[cat] = (summary[cat] || 0) + exp.amount;
    });

    // Round amounts
    for (let cat in summary) {
      summary[cat] = Number(summary[cat].toFixed(2));
    }

    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMonthlySummery = async (req , res) => {
  try {
    const expenses = await Expense.find();

    const monthlyTotals = {};

    expenses.forEach(exp => {
      const date = new Date(exp.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // e.g. 2025-06

      monthlyTotals[key] = (monthlyTotals[key] || 0) + exp.amount;
    });

    for (let month in monthlyTotals) {
      monthlyTotals[month] = Number(monthlyTotals[month].toFixed(2));
    }

    res.status(200).json({ success: true, data: monthlyTotals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getTopSpenders = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const spending = {};

    expenses.forEach(exp => {
      spending[exp.paid_by] = (spending[exp.paid_by] || 0) + exp.amount;
    });

    const summary = Object.entries(spending)
      .map(([person, total]) => ({ person, total: Number(total.toFixed(2)) }))
      .sort((a, b) => b.total - a.total);

    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getTopCategories = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const categories = {};

    expenses.forEach(exp => {
      const cat = exp.category || "Other";
      categories[cat] = (categories[cat] || 0) + exp.amount;
    });

    const sorted = Object.entries(categories)
      .map(([category, total]) => ({ category, total: Number(total.toFixed(2)) }))
      .sort((a, b) => b.total - a.total);

    res.status(200).json({ success: true, data: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
