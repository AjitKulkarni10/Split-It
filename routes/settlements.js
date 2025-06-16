const express = require("express");
const router = express.Router();
const {
  getBalances,
  getPeople,
  getSettlementSummary,
  getCategorySummary,
  getMonthlySummery,
  getTopCategories,
  getTopSpenders
} = require("../controllers/settlementController");

const { handleRecurringExpenses } = require("../utils/recurringHandler")

router.get("/balances", getBalances);
router.get("/summery/settlements", getSettlementSummary);
router.get("/people", getPeople);
router.get("/summery/category", getCategorySummary);
router.get("/summery/monthly", getMonthlySummery);
router.get("/summery/top-category", getTopCategories);
router.get("/summery/spenders", getTopSpenders);

router.post("/recurring/run" , async (req, res) => {
  try {
    await handleRecurringExpenses();
    res.status(200).json({ success: true, message: "Recurring expenses processed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;