const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Todo = require('../models/todo');

// Create a new todo
router.post('/', async (req, res) => {
    console.log("POST /todos hit!", req.body);
  try {
    const { id, user_id, maintext, text_sequence, completed, created_dttm, modified_dttm } = req.body;
    if ( ! id || !user_id || !maintext || text_sequence === undefined || !created_dttm || !modified_dttm) {
        console.log("Dont come here")
      return res.status(400).json({ error: 'Required fields missing' });
    }
    
    const newTodo = {
      id,
      user_id,
      maintext,
      text_sequence,
      completed: completed || false,
      created_dttm,
      modified_dttm
    };
    console.log("Trying to create now")
    const todo = await Todo.createTodo(newTodo);
    console.log("todo",todo)
    res.status(201).json(todo);
  } catch (err) {
    console.log("err",err)
    res.status(500).json({ error: err.message });
  }
});

// Get todos of a user
router.get('/user/:userId', async (req, res) => {
  try {
    const todos = await Todo.getTodosByUser(req.params.userId);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo (partial update)
router.put('/:id', async (req, res) => {
  try {
    
    const updates = req.body;
    console.log("Update Body",req.body)
    updates.modified_dttm = new Date().toISOString();
    console.log("Trying to update now", updates)
    const todo = await Todo.updateTodo(req.params.id, updates);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.deleteTodo(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync todos since last modified date excluding user's own todos
router.get('/sync', async (req, res) => {
  try {
    const { excludeUser, lastSync } = req.query;
    if (!excludeUser || !lastSync) {
      return res.status(400).json({ error: 'excludeUser and lastSync query params required' });
    }
    const todos = await Todo.syncTodos(excludeUser, lastSync);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
