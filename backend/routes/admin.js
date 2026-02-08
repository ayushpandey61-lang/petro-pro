const express = require('express');
const { query, execute } = require('../lib/sqlite');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all admin routes
// router.use(verifyToken); // Temporarily disabled for testing

// Get all roles
router.get('/roles', async (req, res) => {
  try {
    const roles = await query('SELECT * FROM roles ORDER BY name');
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Create a new role
router.post('/roles', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    const result = await execute(
      'INSERT INTO roles (name) VALUES (?)',
      [name]
    );

    res.json({
      id: result.lastID,
      name,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// Update a role
router.put('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    await execute(
      'UPDATE roles SET name = ? WHERE id = ?',
      [name, id]
    );

    res.json({ id: parseInt(id), name });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Delete a role
router.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await execute('DELETE FROM roles WHERE id = ?', [id]);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// Get all permissions
router.get('/permissions', async (req, res) => {
  try {
    const permissions = await query('SELECT * FROM permissions ORDER BY name');
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

// Get role permissions
router.get('/roles/:roleId/permissions', async (req, res) => {
  try {
    const { roleId } = req.params;

    const permissions = await query(`
      SELECT p.id, p.name, p.description
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, [roleId]);

    res.json(permissions);
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({ error: 'Failed to fetch role permissions' });
  }
});

// Update role permissions
router.put('/roles/:roleId/permissions', async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionIds } = req.body;

    // Start transaction
    await execute('BEGIN TRANSACTION');

    try {
      // Delete existing permissions
      await execute('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);

      // Insert new permissions
      if (permissionIds && permissionIds.length > 0) {
        const values = permissionIds.map(permissionId => `(${roleId}, ${permissionId})`).join(', ');
        await execute(`INSERT INTO role_permissions (role_id, permission_id) VALUES ${values}`);
      }

      await execute('COMMIT');
      res.json({ message: 'Permissions updated successfully' });
    } catch (error) {
      await execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating role permissions:', error);
    res.status(500).json({ error: 'Failed to update role permissions' });
  }
});

module.exports = router;