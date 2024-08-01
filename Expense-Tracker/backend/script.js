document.addEventListener('DOMContentLoaded', () => {
  fetchExpenses();

  const form = document.getElementById('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    addExpense();
  });
});

function fetchExpenses() {
  fetch('http://localhost:3000/expenses')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayExpenses(data);
      updateBalance(data);
    })
    .catch(error => console.error('Error fetching expenses:', error));
}

function addExpense() {
  const text = document.getElementById('text').value;
  const amount = parseFloat(document.getElementById('amount').value);

  const expense = {
    name: text,
    amount: amount,
    category: 'General' // You can add a category field in the form if needed
  };

  fetch('http://localhost:3000/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(expense)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Expense added:', data);
    fetchExpenses(); // Refresh the list of expenses
    document.getElementById('text').value = '';
    document.getElementById('amount').value = '';
  })
  .catch(error => console.error('Error adding expense:', error));
}

function displayExpenses(expenses) {
  const expensesList = document.getElementById('list');

  // Clear any existing data
  expensesList.innerHTML = '';

  // Populate the list with fetched expenses
  expenses.forEach(expense => {
    const listItem = document.createElement('li');
    listItem.className = expense.amount < 0 ? 'minus' : 'plus';
    listItem.innerHTML = `
      ${expense.name} <span>${expense.amount < 0 ? '-' : '+'}$${Math.abs(expense.amount)}</span>
      <button class="delete-btn" onclick="deleteExpense('${expense._id}')">x</button>
    `;
    expensesList.appendChild(listItem);
  });
}

function deleteExpense(id) {
  fetch(`http://localhost:3000/expenses/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    fetchExpenses(); // Refresh the list of expenses
  })
  .catch(error => console.error('Error deleting expense:', error));
}

function updateBalance(expenses) {
  const balance = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const income = expenses.filter(expense => expense.amount > 0)
                         .reduce((acc, expense) => acc + expense.amount, 0);
  const expense = expenses.filter(expense => expense.amount < 0)
                          .reduce((acc, expense) => acc + expense.amount, 0);

  document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
  document.getElementById('money-plus').textContent = `+$${income.toFixed(2)}`;
  document.getElementById('money-minus').textContent = `-$${Math.abs(expense).toFixed(2)}`;
}

const hamburger=document.querySelector(".hamburger");
const navMenu=document.querySelector(".nav-menu");

hamburger.addEventListener("click",()=>{
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");

})