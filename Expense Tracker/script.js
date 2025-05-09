// grab DOM elements
const form       = document.getElementById('expense-form');
const amountEl   = document.getElementById('amount');
const categoryEl = document.getElementById('category');
const dateEl     = document.getElementById('date');
const listEl     = document.getElementById('expenses-list');
const totalEl    = document.getElementById('total-expense');
const filterEl   = document.getElementById('filter-category');
const clearBtn   = document.getElementById('clear-btn');

let expenses = [];

// load saved data (if any)
window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('expenses'));
  if (saved) {
    expenses = saved;
    renderExpenses();
  }
});

// add new expense
form.addEventListener('submit', e => {
  e.preventDefault();
  const amt  = parseFloat(amountEl.value).toFixed(2);
  const cat  = categoryEl.value;
  const dt   = dateEl.value;
  if (!amt || !cat || !dt) return;

  expenses.push({ amount: amt, category: cat, date: dt });
  localStorage.setItem('expenses', JSON.stringify(expenses));

  renderExpenses();
  form.reset();
});

// filter change
filterEl.addEventListener('change', renderExpenses);

// render list & total
function renderExpenses() {
  listEl.innerHTML = '';
  const filter = filterEl.value;
  let total = 0;

  expenses.forEach((exp, index) => {
    if (filter !== 'All' && exp.category !== filter) return;
    total += parseFloat(exp.amount);

    const card = document.createElement('div');
    card.className = 'expense-card';
    card.innerHTML = `
      <div class="expense-details">
        <div class="category">${exp.category}</div>
        <div class="date">${exp.date}</div>
      </div>
      <div class="expense-amount">৳ ${exp.amount}</div>
      <button class="delete-btn" data-index="${index}">&times;</button>
    `;
    listEl.appendChild(card);
  });

  totalEl.textContent = total.toFixed(2);
}

// handle delete clicks
listEl.addEventListener('click', e => {
  if (!e.target.classList.contains('delete-btn')) return;
  const idx = parseInt(e.target.dataset.index, 10);
  expenses.splice(idx, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
});

// handle “Clear All”
clearBtn.addEventListener('click', () => {
  if (!confirm('Remove all expenses?')) return;
  expenses = [];
  localStorage.removeItem('expenses');
  renderExpenses();
});
