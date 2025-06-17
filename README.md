# Split-It — Expense Sharing App

A full-stack backend app to split group expenses with support for equal, exact, and percentage-based splits. Built using **Node.js**, **Express**, and **MongoDB**, with a simple HTML frontend.

Deployed at 
[https://split-it-sxjw.onrender.com](https://split-it-sxjw.onrender.com)


[https://split-it-two.vercel.app/](https://split-it-two.vercel.app/)
---

## Features

-  Add expenses (equal / exact / percentage)
-  Track who paid and how much each person owes
-  View net balances for each person
-  Simplified settlement summary (who pays whom)
-  Recurring expenses (monthly, weekly, daily)
-  Analytics: top spender, category summary, monthly summary
-  Clean UI (HTML/JS) for testing without Postman

---

## Stack Used

- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Frontend**: HTML, CSS,  JavaScript
- **Deployment**: Render , Vercel

---

##  Git Repository Structure

```
split-app/
├── public/              # Frontend HTML + JS
│   ├── index.html
│   ├── script.js
│   └── style.css
├── controllers/         # Business logic for routes
├── models/              # Mongoose schemas
├── routes/              # API route handlers
├── utils/               # Settlement and recurring logic
├── .env                 # Environment variables (ignored in Git)
├── package.json
└── server.js
```

---

## Setup Information

### 1. Clone the repository
git clone https://github.com/your-username/split-app.git
cd split-app
npm i
npm run dev

before that add all the dev variables into .env file with containing PORT and MONGO_URL


## API Endpoints

### Expenses

| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/expenses`          | Add a new expense   |
| GET    | `/expenses`          | Get all expenses    |
| PUT    | `/expenses/:id`      | Update an expense   |
| DELETE | `/expenses/:id`      | Delete an expense   |

### Analytics & Balances

| Method | Endpoint                      | Description               |
|--------|-------------------------------|---------------------------|
| GET    | `/balances`                   | Net balance per person    |
| GET    | `/settlements`                | Simplified settlements    |
| GET    | `/people`                     | All unique participants   |
| GET    | `/summary/categories`         | Category-wise totals      |
| GET    | `/summary/monthly`            | Monthly spending summary  |
| GET    | `/summary/spenders`           | Top spenders              |
| GET    | `/summary/top-categories`     | Top categories spent      |

### Recurring

| Method | Endpoint           | Description                     |
|--------|--------------------|---------------------------------|
| POST   | `/recurring/run`   | Process recurring expenses      |


gist file for all endpoints :
https://gist.github.com/AjitKulkarni10/b12e5f887e5f22fc197b38c86cc6524e