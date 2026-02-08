const fetch = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@petrolpump.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);
  } catch (error) {
    console.error('Login error:', error);
  }
}

async function testLubricantsSale() {
  try {
    const response = await fetch('http://localhost:5000/api/day-business/lubricants-sale');
    const data = await response.json();
    console.log('Lubricants sale response:', data);
  } catch (error) {
    console.error('Lubricants sale error:', error);
  }
}

testLogin();
testLubricantsSale();