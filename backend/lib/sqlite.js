const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

// SQLite database file path
const DB_PATH = path.join(__dirname, '../../petrol_pump.db');

// Create database connection
async function connectDB() {
  try {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    console.log('✅ SQLite database connected successfully');
    return db;
  } catch (error) {
    console.error('❌ SQLite connection failed:', error.message);
    throw error;
  }
}

// Query helper function
async function query(sql, params = []) {
  let db;
  try {
    db = await connectDB();
    const result = await db.all(sql, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// Single row query
async function queryOne(sql, params = []) {
  let db;
  try {
    db = await connectDB();
    const result = await db.get(sql, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// Execute (for INSERT, UPDATE, DELETE)
async function execute(sql, params = []) {
  let db;
  try {
    db = await connectDB();
    const result = await db.run(sql, params);
    return result;
  } catch (error) {
    console.error('Database execute error:', error.message);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// Transaction helper
async function transaction(callback) {
  let db;
  try {
    db = await connectDB();
    await db.exec('BEGIN TRANSACTION');
    const result = await callback(db);
    await db.exec('COMMIT');
    return result;
  } catch (error) {
    if (db) {
      await db.exec('ROLLBACK');
    }
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }
}

module.exports = {
  connectDB,
  query,
  queryOne,
  execute,
  transaction
};