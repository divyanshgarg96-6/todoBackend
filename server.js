require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('TODO Backend is running!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


