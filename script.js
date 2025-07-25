const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Get data from localStorage or start fresh
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please enter both description and amount');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value  // converts string to number
  };

  transactions.push(transaction);
  updateLocalStorage();
  addTransactionDOM(transaction);
  updateValues();

  text.value = '';
  amount.value = '';
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Update balance, income, and expense
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const incomeTotal = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expenseTotal = (
    amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.innerText = `₹${total}`;
  income.innerText = `+₹${incomeTotal}`;
  expense.innerText = `-₹${expenseTotal}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener('submit', addTransaction);

init();
