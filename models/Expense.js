const mongoose = require("mongoose");

const splitSchema = new mongoose.Schema({
  person: { type: String, required: true },
  value: { type: Number, required: true }
});

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0.01 },
  description: { type: String, required: true },
  paid_by: { type: String, required: true },
  participants: [{ type: String, required: true }],
  split_type: {
    type: String,
    enum: ["equal", "percentage", "exact"],
    default: "equal"
  },
  splits: [splitSchema], // optional, used for percentage/exact
  category: {
    type: String,
    enum: ["Food", "Travel", "Utilities", "Entertainment", "Other"],
    default: "Other"
  },
  recurring: {
  isRecurring: { type: Boolean, default: false },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "monthly"
  },
  startDate: Date,
  nextDate: Date
}

}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
