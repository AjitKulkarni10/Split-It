// require("dotenv").config();
const BASE_URL = "https://split-it-sxjw.onrender.com"; // Replace with deployed URL

document.getElementById("expenseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const body = {
    description: form.description.value,
    amount: Number(form.amount.value),
    paid_by: form.paid_by.value,
    participants: form.participants.value.split(',').map(p => p.trim()),
    split_type: form.split_type.value,
    category: formatCategory(form.category.value) || "other"
  };

  if (form.splits.value) {
    try {
      body.splits = JSON.parse(form.splits.value);
    } catch {
      alert("Invalid JSON in splits");
      return;
    }
  }

  function formatCategory(cat) {
    if (!cat) return "Other";
    const cleaned = cat.trim().toLowerCase();
    const categories = ['food', 'travel', 'utilities', 'entertainment', 'other'];
    return categories.includes(cleaned)
        ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
        : "Other";
    }

  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  alert(data.message || "Expense added");
  form.reset();
  loadAll();
});

async function loadAll() {
  const [expenses, balances, settlements] = await Promise.all([
    fetch(`${BASE_URL}/expenses`).then(res => res.json()),
    fetch(`${BASE_URL}/balances`).then(res => res.json()),
    fetch(`${BASE_URL}/summery/settlements`).then(res => res.json())
  ]);

  renderExpenses(expenses.data);
  renderBalances(balances.data);
  renderSettlements(settlements.data);
}

function renderExpenses(expenses) {
  const container = document.getElementById("expensesOutput");
  container.innerHTML = "";
  expenses.forEach(exp => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${exp.description}</strong> - ₹${exp.amount} <br/>
      Paid by: ${exp.paid_by} | Split: ${exp.split_type} | Category: ${exp.category} <br/>
      Participants: ${exp.participants.join(", ")} <br/>
      <hr/>
    `;
    container.appendChild(div);
  });
}

function renderBalances(balances) {
  const container = document.getElementById("balancesOutput");
  container.innerHTML = "<ul>";
  for (const person in balances) {
    const amount = balances[person];
    const sign = amount >= 0 ? "gets back" : "owes";
    const formatted = Math.abs(amount).toFixed(2);
    container.innerHTML += `<li><strong>${person}</strong> ${sign} ₹${formatted}</li>`;
  }
  container.innerHTML += "</ul>";
}

function renderSettlements(settlements) {
  const container = document.getElementById("settlementsOutput");
  container.innerHTML = "<ul>";
  settlements.forEach(settle => {
    container.innerHTML += `<li><strong>${settle.from}</strong> pays <strong>${settle.to}</strong> ₹${settle.amount.toFixed(2)}</li>`;
  });
  container.innerHTML += "</ul>";
}

loadAll();