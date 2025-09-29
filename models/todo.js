const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

module.exports = {
  createTodo: async (todo) => {
    const query = `
      INSERT INTO todos 
        (id, user_id, text, text_sequence, completed, created_dttm, modified_dttm)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    return db.one(query, [
      todo.id,
      todo.user_id,
      todo.text,
      todo.text_sequence,
      todo.completed || false,
      todo.created_dttm,
      todo.modified_dttm,
    ]);
  },

  getTodosByUser: async (userId) => {
    const query = `SELECT * FROM todos WHERE user_id=$1 ORDER BY text_sequence ASC`;
    return db.any(query, [userId]);
  },

  updateTodo: async (id, updates) => {
    const setStr = [];
    const values = [];
    let idx = 1;
    for (const key in updates) {
      setStr.push(`${key} = $${idx++}`);
      values.push(updates[key]);
    }
    values.push(id); // for WHERE clause
    const query = `UPDATE todos SET ${setStr.join(', ')} WHERE id = $${idx} RETURNING *`;
    return db.oneOrNone(query, values);
  },

  deleteTodo: async (id) => {
    const query = `DELETE FROM todos WHERE id=$1`;
    return db.result(query, [id]);
  },

  syncTodos: async (excludeUser, lastSyncDate) => {
    const query = `
      SELECT * FROM todos
      WHERE user_id != $1 AND modified_dttm > $2
      ORDER BY modified_dttm ASC`;
    return db.any(query, [excludeUser, lastSyncDate]);
  }
};
