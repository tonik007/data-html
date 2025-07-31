const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static serve views/ and data/
app.use(express.static(path.join(__dirname, 'views')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// File path for JSON
const userFilePath = path.join(__dirname, 'data', 'users.json');

// POST: Handle form submit
app.post('/submit', (req, res) => {
  const { name, email, number } = req.body;
  const newUser = { name, email, number };

  let users = [];
  if (fs.existsSync(userFilePath)) {
    users = JSON.parse(fs.readFileSync(userFilePath) || '[]');
  }

  users.push(newUser);
  fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
  res.send("✅ সাবমিট সফল হয়েছে!");
});

// GET: Return all users as JSON
app.get('/users', (req, res) => {
  if (!fs.existsSync(userFilePath)) return res.json([]);
  const users = JSON.parse(fs.readFileSync(userFilePath) || '[]');
  res.json(users);
});

// DELETE: Delete user by email
app.delete('/delete', (req, res) => {
  const { email } = req.body;

  if (!fs.existsSync(userFilePath)) return res.status(404).send("Not found");

  let users = JSON.parse(fs.readFileSync(userFilePath) || '[]');
  users = users.filter(user => user.email !== email);
  fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));

  res.send("✅ Deleted");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
