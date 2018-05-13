const { Client } = require('pg');
const config = require('./config/configDB');
const client = new Client(config);

module.exports = async () => {

  await client.connect();
    
  await client.query(
  `CREATE TABLE IF NOT EXISTS ${config.tables.users} (
    id varchar PRIMARY KEY,
    username varchar(50) UNIQUE NOT NULL,
    first_name varchar,
    last_name varchar,
    birthday date,
    email varchar UNIQUE NOT NULL,
    avatar_url varchar,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${config.tables.articles} (
    id varchar PRIMARY KEY,
    name varchar NOT NULL,
    describe varchar NOT NULL,
    user_id int REFERENCES ${config.tables.users} (id),
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${config.tables.credentials} (
    id varchar PRIMARY KEY,
    user_id int REFERENCES ${config.tables.users} (id),
    hashed_password varchar NOT NULL,
    salt varchar NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${config.tables.payment} (
    id varchar PRIMARY KEY,
    user_id int REFERENCES ${config.tables.users} (id),
    article_id int REFERENCES ${config.tables.articles} (id),
    amout bigint NOT NULL CHECK (amout_payment > 0),
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${config.tables.likes} (
    id varchar PRIMARY KEY,
    user_id int REFERENCES ${config.tables.users} (id),
    article_id int REFERENCES ${config.tables.articles} (id),
    is_likes boolean,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${config.tables.clients} (
    id varchar PRIMARY KEY,
    name varchar NOT NULL,
    secret varchar NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp
  )`);

  console.log("MIRATIONS CREATED!");

  await client.end();
};
