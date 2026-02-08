// Test script for Roles and Permissions API
// Run this to test if the backend API is working correctly

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testRolesPermissionsAPI() {
    console.log('🧪 Testing Roles and Permissions API...\n');

    try {
        // Test 1: Get all roles
        console.log('1️⃣  Testing GET /admin/roles...');
        const rolesResponse = await axios.get(`${BASE_URL}/admin/roles`);
        console.log(`✅ Found ${rolesResponse.data.length} roles`);
        console.log('   Sample roles:', rolesResponse.data.slice(0, 3).map(r => r.name));

        // Test 2: Get all permissions
        console.log('\n2️⃣  Testing GET /admin/permissions...');
        const permissionsResponse = await axios.get(`${BASE_URL}/admin/permissions`);
        console.log(`✅ Found ${permissionsResponse.data.length} permissions`);
        console.log('   Sample permissions:', permissionsResponse.data.slice(0, 3).map(p => p.name));

        // Test 3: Create a new role
        console.log('\n3️⃣  Testing POST /admin/roles...');
        const newRole = {
            name: `Test Role ${Date.now()}`
        };
        const createRoleResponse = await axios.post(`${BASE_URL}/admin/roles`, newRole);
        console.log('✅ Created role:', createRoleResponse.data.name);

        const newRoleId = createRoleResponse.data.id;

        // Test 4: Get role permissions
        console.log('\n4️⃣  Testing GET /admin/roles/:id/permissions...');
        const rolePermissionsResponse = await axios.get(`${BASE_URL}/admin/roles/${newRoleId}/permissions`);
        console.log(`✅ Role has ${rolePermissionsResponse.data.length} permissions`);

        // Test 5: Update role permissions
        console.log('\n5️⃣  Testing PUT /admin/roles/:id/permissions...');
        const permissionIds = permissionsResponse.data.slice(0, 3).map(p => p.id);
        await axios.put(`${BASE_URL}/admin/roles/${newRoleId}/permissions`, {
            permissionIds: permissionIds
        });
        console.log(`✅ Updated role with ${permissionIds.length} permissions`);

        // Test 6: Update role name
        console.log('\n6️⃣  Testing PUT /admin/roles/:id...');
        const updatedRole = {
            name: `Updated Test Role ${Date.now()}`
        };
        await axios.put(`${BASE_URL}/admin/roles/${newRoleId}`, updatedRole);
        console.log('✅ Updated role name');

        // Test 7: Delete the test role
        console.log('\n7️⃣  Testing DELETE /admin/roles/:id...');
        await axios.delete(`${BASE_URL}/admin/roles/${newRoleId}`);
        console.log('✅ Deleted test role');

        console.log('\n🎉 All API tests passed successfully!');
        console.log('\n📋 Summary:');
        console.log(`   • Roles endpoint: ✅ Working`);
        console.log(`   • Permissions endpoint: ✅ Working`);
        console.log(`   • Role creation: ✅ Working`);
        console.log(`   • Permission management: ✅ Working`);
        console.log(`   • Role updates: ✅ Working`);
        console.log(`   • Role deletion: ✅ Working`);

        console.log('\n🚀 The Roles and Permissions system is ready to use!');
        console.log('   Navigate to: Super Admin > Role & Permission');

    } catch (error) {
        console.error('\n❌ API Test Failed:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Data:`, error.response.data);
        } else {
            console.error(`   Error: ${error.message}`);
        }

        console.error('\n🔧 Troubleshooting:');
        console.error('   1. Make sure the backend server is running on port 5000');
        console.error('   2. Check if the database is properly set up');
        console.error('   3. Verify the API routes are registered in the backend');
        console.error('   4. Check the network connection');

        process.exit(1);
    }
}

// Run the tests
testRolesPermissionsAPI();