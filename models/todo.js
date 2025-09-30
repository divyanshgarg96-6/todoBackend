const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

module.exports = {
  createTodo: async (todo) => {
    console.log("inside create todo ",todo)
    const query = `
      INSERT INTO todos 
        ( user_id, maintext, text_sequence, completed, created_dttm, modified_dttm)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
      console.log("query",query)
      console.log("process.env.DATABASE_URL",process.env.DATABASE_URL)
      // console.log("db",db)
    return db.one(query, [
      // todo.id,
      todo.user_id,
      todo.maintext,
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
  const setFragments = [];
  const values = [];
  let idx = 1;


  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      setFragments.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (setFragments.length === 0) {
    // Nothing to update
    return db.oneOrNone('SELECT * FROM todos WHERE id = $1', [id]);
  }

  // Add id for WHERE clause
  values.push(id);

  const query = `
    UPDATE todos
       SET ${setFragments.join(', ')}
     WHERE id = $${idx}
     RETURNING *;
  `;

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
