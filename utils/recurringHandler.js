const Expense = require("../models/Expense");

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

const getNextDate = (current, freq) => {
  if (freq === "daily") 
        return addDays(current, 1);
  if (freq === "weekly") 
        return addDays(current, 7);
  if (freq === "monthly") {
    const newDate = new Date(current);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
  }
};

const handleRecurringExpenses = async () => {
  const today = new Date();
  const recurringExpenses = await Expense.find({ "recurring.isRecurring": true });

  for (const exp of recurringExpenses) {
    const nextDate = new Date(exp.recurring.nextDate);
    if (nextDate <= today) {
      // Duplicate the expense and update nextDate
      const newExpense = new Expense({
        amount: exp.amount,
        description: exp.description,
        paid_by: exp.paid_by,
        participants: exp.participants,
        split_type: exp.split_type,
        splits: exp.splits,
        category: exp.category,
        recurring: {
          ...exp.recurring,
          startDate: exp.recurring.startDate,
          nextDate: getNextDate(nextDate, exp.recurring.frequency)
        }
      });
      await newExpense.save();

      // Update original record"s nextDate
      exp.recurring.nextDate = newExpense.recurring.nextDate;
      await exp.save();
    }
  }
};

module.exports = { handleRecurringExpenses };
