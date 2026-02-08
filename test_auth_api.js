const fetch = require('node-fetch');

async function testLoginAndLubricantsSale() {
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

    // Now test the lubricants sale endpoint with the token
    const lubricantsResponse = await fetch('http://localhost:5000/api/day-business/lubricants-sale', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });

    const lubricantsData = await lubricantsResponse.json();
    console.log('Lubricants sale response:', lubricantsData);

    // Test creating a new lubricants sale
    const createResponse = await fetch('http://localhost:5000/api/day-business/lubricants-sale', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sale_date: '2025-09-26',
        product_id: 1,
        quantity: 10,
        rate: 100,
        amount: 1000,
        discount: 0,
        shift_id: 1,
        employee_id: 1,
        description: 'Test sale',
        sale_type: 'Cash'
      })
    });

    const createData = await createResponse.json();
    console.log('Create lubricants sale response:', createData);

  } catch (error) {
    console.error('Error:', error);
  }
}

testLoginAndLubricantsSale();