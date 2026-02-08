# Roles & Permissions System

A complete, professional-grade roles and permissions management system for the PetroPro application with premium UI design.

## 🎯 Features

- **Complete Database Schema**: Structured tables for roles, permissions, and user assignments
- **RESTful API**: Full backend API for managing roles and permissions
- **Premium Frontend**: Beautiful, responsive UI with modern design patterns
- **Granular Permissions**: Detailed permission system with module-based access control
- **Real-time Updates**: Live data synchronization between frontend and backend
- **Professional UX**: Loading states, animations, and intuitive user interface

## 📊 Database Schema

### Tables Created

1. **roles** - User roles in the system
   - `id` - Primary key
   - `name` - Role name (unique)
   - `description` - Role description
   - `created_at` - Creation timestamp
   - `updated_at` - Last update timestamp

2. **permissions** - Available permissions
   - `id` - Primary key
   - `name` - Permission name (unique)
   - `description` - Permission description
   - `module` - Module category
   - `created_at` - Creation timestamp

3. **role_permissions** - Links roles to permissions
   - `id` - Primary key
   - `role_id` - Foreign key to roles
   - `permission_id` - Foreign key to permissions
   - `created_at` - Creation timestamp

4. **user_roles** - Assignment of roles to users
   - `id` - Primary key
   - `user_id` - User identifier
   - `role_id` - Foreign key to roles
   - `assigned_by` - Who assigned the role
   - `assigned_at` - Assignment timestamp

## 🔐 Default Roles & Permissions

### Pre-configured Roles

- **Super Admin** - Full system access with all permissions
- **Manager** - Management level access with most permissions
- **Supervisor** - Supervisory access with operational permissions
- **Operator** - Basic operational access
- **Accountant** - Financial and reporting access
- **Clerk** - Limited data entry access

### Permission Categories

- **Dashboard** - Dashboard view and edit permissions
- **Master Data** - Product, vendor, and master data management
- **Daily Business** - Day-to-day operational permissions
- **Invoices** - Invoice creation, editing, and management
- **Reports** - Report viewing, creation, and export
- **Settings** - Application settings management
- **Administration** - User management and system configuration
- **Super Admin** - Backup, security, and advanced administration

## 🚀 Quick Setup

### 1. Database Setup

Run the setup script to create all necessary tables:

```bash
# From the project root directory
node database/setup_roles_permissions.js
```

Or manually execute the SQL file:
```sql
-- Run this in your SQLite database
.read database/roles_permissions_tables.sql
```

### 2. Backend Setup

The backend API routes are already configured in `backend/routes/admin.js`:

- `GET /admin/roles` - Get all roles
- `POST /admin/roles` - Create new role
- `PUT /admin/roles/:id` - Update role
- `DELETE /admin/roles/:id` - Delete role
- `GET /admin/permissions` - Get all permissions
- `GET /admin/roles/:roleId/permissions` - Get role permissions
- `PUT /admin/roles/:roleId/permissions` - Update role permissions

### 3. Frontend Usage

The frontend is already updated to use the backend API:

- Navigate to **Super Admin > Role & Permission**
- Or use the **Roles & Permissions** page
- The system will automatically connect to the backend API

## 💻 API Usage Examples

### Get All Roles
```javascript
const roles = await apiClient.request('/admin/roles');
```

### Create New Role
```javascript
const newRole = await apiClient.request('/admin/roles', {
    method: 'POST',
    body: JSON.stringify({ name: 'Custom Role' })
});
```

### Update Role Permissions
```javascript
await apiClient.request(`/admin/roles/${roleId}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds: [1, 2, 3] })
});
```

## 🎨 UI Components

### Reusable Components Created

1. **RoleCard** (`frontend/src/components/roles/RoleCard.jsx`)
   - Premium card design for role display
   - Avatar with role initials
   - Permission preview
   - Action dropdown menu

2. **PermissionGrid** (`frontend/src/components/roles/PermissionGrid.jsx`)
   - Organized permission display by category
   - Checkbox selection interface
   - Permission descriptions and tooltips

3. **RoleForm** (`frontend/src/components/roles/RoleForm.jsx`)
   - Professional form for role creation/editing
   - Role name suggestions
   - Form validation and loading states

## 🔧 Advanced Features

### Database Functions

- `user_has_permission(user_id, permission_name)` - Check if user has specific permission
- `get_user_permissions(user_id)` - Get all user permissions
- `role_permissions_view` - View for easy role-permission queries

### Utility Functions

```sql
-- Check if user has permission
SELECT user_has_permission(1, 'dashboard.edit');

-- Get user permissions
SELECT * FROM get_user_permissions(1);

-- View role permissions
SELECT * FROM role_permissions_view WHERE role_name = 'Manager';
```

## 🎯 Usage Scenarios

### Scenario 1: Create Custom Role
1. Click "Add New Role"
2. Enter role name (e.g., "Branch Manager")
3. Click "Add Role"
4. Select the new role and click "Manage Permissions"
5. Choose appropriate permissions
6. Save changes

### Scenario 2: Modify Existing Role
1. Find the role in the "Manage Roles" section
2. Click the menu button (three dots)
3. Select "Edit" to change the name
4. Or select "Manage Permissions" to modify access

### Scenario 3: Assign Role to User
```javascript
// In your user management code
await apiClient.request('/admin/user-roles', {
    method: 'POST',
    body: JSON.stringify({
        user_id: userId,
        role_id: roleId
    })
});
```

## 🔍 Troubleshooting

### Common Issues

1. **"Database tables don't exist"**
   - Run the setup script: `node database/setup_roles_permissions.js`

2. **"API connection failed"**
   - Ensure backend server is running
   - Check network connectivity
   - Verify API endpoints are accessible

3. **"Permission denied"**
   - Check user authentication
   - Verify user has required permissions
   - Ensure role is properly assigned

### Debug Mode

Enable debug logging in the frontend:
```javascript
// In browser console
localStorage.setItem('debug', 'api:*');
```

## 🚀 Performance Tips

- Indexes are automatically created for optimal query performance
- Use pagination for large datasets
- Cache frequently accessed permissions
- Consider permission hierarchies for complex scenarios

## 🔒 Security Considerations

- All API endpoints require authentication
- Input validation on both frontend and backend
- SQL injection protection with parameterized queries
- Role-based access control implemented
- Audit trail for permission changes

## 📈 Future Enhancements

- [ ] Permission hierarchies and inheritance
- [ ] Time-based permissions
- [ ] Department/location-based access
- [ ] Permission templates
- [ ] Bulk permission assignment
- [ ] Permission usage analytics

---

**Created with ❤️ for PetroPro - Professional Petrol Pump Management System**