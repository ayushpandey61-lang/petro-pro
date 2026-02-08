const fetch = require('node-fetch');

async function testSalesData() {
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

    // Test sales data endpoint
    const response = await fetch('http://localhost:5000/api/day-business/lubricants-sale', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });

    const salesData = await response.json();
    console.log('Sales data response:', salesData);

    if (salesData.length > 0) {
      console.log('First sale record:', salesData[0]);
      console.log('Types of IDs:');
      console.log('  shift_id type:', typeof salesData[0].shift_id, 'value:', salesData[0].shift_id);
      console.log('  product_id type:', typeof salesData[0].product_id, 'value:', salesData[0].product_id);
      console.log('  employee_id type:', typeof salesData[0].employee_id, 'value:', salesData[0].employee_id);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testSalesData();