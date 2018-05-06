const { Client } = require('pg');
const config = require('./config/configDB');
const client = new Client(config);

module.exports = async () => {

  await client.connect();

  await client.query(
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username varchar(50) UNIQUE NOT NULL,
    first_name varchar,
    last_name varchar,
    birthday date,
    email varchar,
    avatarUrl varchar,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  console.log("CRATED TABLE USERS");

  await client.query(`CREATE TABLE IF NOT EXISTS ideas (
    id SERIAL PRIMARY KEY,
    idea_name varchar NOT NULL,
    idea_describe varchar NOT NULL,
    user_id int REFERENCES users (id),
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  console.log("CRATED TABLE IDEAS");

  await client.query(`CREATE TABLE IF NOT EXISTS user_credentials (
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users (id),
    hashed_password varchar NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  console.log("CRATED TABLE USER_CREDENTIALS");

  await client.query(`CREATE TABLE IF NOT EXISTS user_likes (
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users (id),
    ideas_id int REFERENCES ideas (id),
    amout_payment bigint NOT NULL CHECK (amout_payment > 0),
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  console.log("CRATED TABLE USER_LIKES");

  await client.query(`CREATE TABLE IF NOT EXISTS user_payment (
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users (id),
    ideas_id int REFERENCES ideas (id),
    is_likes boolean,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  console.log("CRATED TABLE USER_PAYMENT");

  await client.end();
};
