const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);

module.exports = {
  //Completed
  createTodo: async (todo) => {
    console.log("inside create todo ", todo);
    const query = `
      INSERT INTO todos 
        ( id, user_id, maintext, text_sequence, completed, created_dttm, modified_dttm)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    console.log("query", query);
    console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
    return db.one(query, [
      todo.id,
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

  //Completed
  updateTodo: async (id, updates) => {
    console.log("INside updateTod", "id", id, "updates",updates)
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
      return db.oneOrNone("SELECT * FROM todos WHERE id = $1", [id]);
    }

    values.push(id);
    console.log("setFragments",setFragments)
    console.log("values",values)
    const query = `
    UPDATE todos
       SET ${setFragments.join(", ")}
     WHERE id = $${idx}
     RETURNING *;
  `;

    return db.oneOrNone(query, values);
  },

  //Completed
  deleteTodo: async (id, modified_dttm) => {
    console.log("Inside deleteTodo",id)
  const query = `
    UPDATE todos
    SET deleted = true,
        deleted_dttm = $2,
        modified_dttm = $2
    WHERE id = $1
  `;
  return db.none(query, [id, now]);

    
  const now = new Date().toISOString();


  },

  syncTodos: async (excludeUser, lastSyncDate) => {
    const query = `
      SELECT * FROM todos
      WHERE user_id != $1 AND modified_dttm > $2
      ORDER BY modified_dttm ASC`;
    return db.any(query, [excludeUser, lastSyncDate]);
  },

  markCompleted: async (id, modified_dttm) => {
    const query = `
      UPDATE todos
         SET completed     = TRUE,
             modified_dttm = $2
       WHERE id = $1
       RETURNING *;
    `;
    return db.oneOrNone(query, [id, modified_dttm]);
  },
};
