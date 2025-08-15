
import mysql from 'mysql2/promise';

export async function getMySql() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'rootpass',
    database: process.env.MYSQL_DB || 'standups',
  });
  await conn.execute(`CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )`);
  return conn;
}
