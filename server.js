const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();
const path = require('path');

// console.log(process.env.MONGO_URI);


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const expenseRoutes = require("./routes/expenses");
const settlementRoutes = require("./routes/settlements");

app.get("/", (req, res) => {
  res.send("✅ Expense Splitter API is running!");
});
app.use("/expenses", expenseRoutes);
app.use("/", settlementRoutes); // Add more as you go

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running...");
    });
  })
  .catch(err => console.error(err));
