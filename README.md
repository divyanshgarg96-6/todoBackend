# TODO Backend

## Setup

- Copy `.env` and fill database credentials.
- Run `npm install`.
- Ensure PostgreSQL backend (e.g. Supabase DB) has table `todos` with schema:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  text_sequence INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_dttm TIMESTAMPTZ DEFAULT NOW(),
  modified_dttm TIMESTAMPTZ DEFAULT NOW()
);

- Run `npm start` to launch backend server.

## API Endpoints

- POST `/todos` - Create todo.
- GET `/todos/user/:userId` - Get todos for user.
- PUT `/todos/:id` - Update todo.
- DELETE `/todos/:id` - Delete todo.
- GET `/todos/sync?excludeUser={userId}&lastSync={ISO date}` - Get changed todos excluding own after lastSync.
