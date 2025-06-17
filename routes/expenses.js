const express = require("express");
const router = express.Router();
const { addExpense , getAllExpenses , updateExpense , deleteExpense } = require("../controllers/expenseController");

// TODO: Add GET, PUT, DELETE later

router.post("/", addExpense);
router.get("/", getAllExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
