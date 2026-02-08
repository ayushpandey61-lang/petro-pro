import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function setupMySQL() {
  let connection;

  try {
    console.log('🚀 Setting up MySQL database for Petrol Pump Management System...\n');

    // Create connection without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'petrol_pump';

    // Create database if it doesn't exist
    console.log(`📊 Creating database: ${dbName}`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.execute(`USE ${dbName}`);

    // Read and execute SQL setup file
    console.log('📝 Reading SQL setup file...');
    const sqlFilePath = path.join(__dirname, 'mysql_setup.sql');

    if (!fs.existsSync(sqlFilePath)) {
      console.error('❌ mysql_setup.sql file not found!');
      console.log('Please ensure mysql_setup.sql is in the same directory as this script.');
      return;
    }

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split SQL file into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log('⚡ Executing SQL statements...');

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.execute(statement);
        } catch (error) {
          // Ignore errors for statements that might already exist
          if (!error.message.includes('Duplicate entry') &&
              !error.message.includes('already exists') &&
              !error.message.includes('Duplicate key')) {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message);
          }
        }
      }
    }

    console.log('✅ Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your backend/.env file with your MySQL credentials');
    console.log('2. Start the backend server: cd backend && npm start');
    console.log('3. Start the frontend: npm run dev');
    console.log('\n🌐 Access the application at: http://localhost:5173');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is installed and running');
    console.log('2. Check your MySQL credentials in the .env file');
    console.log('3. Ensure you have CREATE DATABASE privileges');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupMySQL();
}

export { setupMySQL };