import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'bonus_user',
  password: process.env.DB_PASS || 'bonuspass',
  database: process.env.DB_NAME || 'bonus_db',
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
