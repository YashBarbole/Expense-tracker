const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your MongoDB connection string
const dbURI = 'mongodb+srv://digvijaykesare1123:Vijay%401123@cluster0.jthgjzy.mongodb.net/expense';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Use CORS middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Allow specific origin
}));

// Use body-parser middleware
app.use(bodyParser.json());

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/expenses', async (req, res) => {
  const { name, amount, category } = req.body;

  const newExpense = new Expense({
    name,
    amount,
    category
  });

  app.delete('/expenses/:id', async (req, res) => {
    try {
      const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
      if (!deletedExpense) {
        return res.status(404).send();
      }
      res.status(200).json(deletedExpense);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  

  try {
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
