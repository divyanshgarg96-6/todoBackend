const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory todo storage (use DB in real scenarios)
let todos = [
  { id: '1', text: 'Sample Todo 1', completed: false, updated_at: Date.now(), text_sequence: 0 },
  { id: '2', text: 'Sample Todo 2', completed: true, updated_at: Date.now(), text_sequence: 0 }
];

// GET /todos - List all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos - Create a new todo
app.post('/todos', (req, res) => {
  const todo = {
    id: Date.now().toString(),
    text: req.body.text || '',
    completed: req.body.completed || false,
    updated_at: Date.now(),
    text_sequence: req.body.text_sequence || 0
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT /todos/:id - Update a todo
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });

  todos[index] = {
    id,
    text: req.body.text || todos[index].text,
    completed: req.body.completed ?? todos[index].completed,
    updated_at: Date.now(),
    text_sequence: req.body.text_sequence ?? todos[index].text_sequence
  };
  res.json(todos[index]);
});

// DELETE /todos/:id - Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  todos = todos.filter(t => t.id !== id);
  res.status(204).send();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Todo API listening on port ${PORT}`);
});
