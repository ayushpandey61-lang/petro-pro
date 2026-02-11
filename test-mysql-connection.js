require('dotenv').config();
const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('🔄 Testing MySQL connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'petrol_user',
    password: process.env.DB_PASSWORD || 'petrol_password',
    database: process.env.DB_NAME || 'petrol_pump'
  };

  console.log('Configuration:');
  console.log('  Host:', config.host);
  console.log('  User:', config.user);
  console.log('  Database:', config.database);
  console.log('  Password:', '*'.repeat(config.password.length));
  console.log('');

  try {
    // Try to connect
    const connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL!');

    // Test query
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log('✅ MySQL Version:', rows[0].version);

    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables in database`);
    
    if (tables.length > 0) {
      console.log('\nExisting tables:');
      tables.forEach(table => {
        console.log('  -', Object.values(table)[0]);
      });
    } else {
      console.log('\n⚠️  No tables found. Run: node database/init-mysql.js');
    }

    await connection.end();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL server is not running or not accessible.');
      console.error('   Solution: Start MySQL service or use Docker:');
      console.error('   docker-compose up -d mysql');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Check your credentials in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist.');
      console.error('   Solution: Run the initialization script:');
      console.error('   node database/init-mysql.js');
    }
    
    console.error('\n📖 For detailed setup instructions, see: MYSQL_SETUP_GUIDE.md\n');
    process.exit(1);
  }
}

testMySQLConnection();
