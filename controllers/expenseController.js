const Expense = require("../models/Expense");

// POST /expenses
exports.addExpense = async (req, res) => {
  try {
    const { amount, description, paid_by, participants, split_type, splits , category  , recurring} = req.body;

    // Basic validations
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be positive" });
    }
    if (!description || !paid_by || !participants?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const expense = await Expense.create({
      amount,
      description,
      paid_by,
      participants,
      split_type: split_type || "equal",
      splits: splits || [],
      category: category || "Other",
      recurring : recurring || {
        isRecurring : false
      }
    });

    res.status(201).json({
      success: true,
      data: expense,
      message: "Expense added successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: updated, message: "Expense updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

