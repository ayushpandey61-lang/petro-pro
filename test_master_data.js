const fetch = require('node-fetch');

async function testMasterData() {
  try {
    // First, login to get the token
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@petrolpump.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.token) {
      console.error('Login failed');
      return;
    }

    // Test master data endpoints
    const endpoints = ['shifts', 'lubricants', 'employees'];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:5000/api/master/${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        console.log(`${endpoint} response:`, data);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testMasterData();