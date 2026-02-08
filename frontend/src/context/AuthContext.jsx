import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
      const { toast } = useToast();
      const navigate = useNavigate();

      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [userPermissions, setUserPermissions] = useState([]);
      const [userRole, setUserRole] = useState(null);

      // Local user storage key
      const USERS_STORAGE_KEY = 'petropro_users';
      const CURRENT_USER_KEY = 'petropro_current_user';

      // Get permissions based on role
      const getPermissionsForRole = useCallback((roleName) => {
        const rolePermissions = {
          'Super Admin': ['*'],
          'Manager': ['dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 'invoice.view', 'invoice.create', 'reports.view'],
          'Supervisor': ['dashboard.view', 'day_business.view', 'day_business.edit', 'reports.view'],
          'Operator': ['dashboard.view', 'day_business.view'],
          'Viewer': ['dashboard.view']
        };
        return rolePermissions[roleName] || ['dashboard.view'];
      }, []);

      // Get all users from localStorage
      const getUsers = useCallback(() => {
        try {
          const users = localStorage.getItem(USERS_STORAGE_KEY);
          return users ? JSON.parse(users) : {};
        } catch (error) {
          console.error('Error loading users:', error);
          return {};
        }
      }, []);

      // Save users to localStorage
      const saveUsers = useCallback((users) => {
        try {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        } catch (error) {
          console.error('Error saving users:', error);
        }
      }, []);

      // Initialize with default admin user if no users exist
      const initializeDefaultUsers = useCallback(() => {
        const users = getUsers();

        if (Object.keys(users).length === 0) {
          const defaultUsers = {
            'admin@petropro.com': {
              id: 'admin-user-123',
              email: 'admin@petropro.com',
              password: 'admin', // In production, this should be hashed
              name: 'Administrator',
              role: 'Super Admin',
              is_super_admin: true,
              created_at: new Date().toISOString(),
              isActive: true
            }
          };

          saveUsers(defaultUsers);
          console.log('✅ Default admin user initialized');
          return defaultUsers;
        }

        return users;
      }, [getUsers, saveUsers]);

      // Initialize authentication
      useEffect(() => {
        const initAuth = () => {
          try {
            // Initialize default users if needed
            const users = initializeDefaultUsers();

            // Check if user is already logged in
            const currentUserData = localStorage.getItem(CURRENT_USER_KEY);

            if (currentUserData) {
              const currentUser = JSON.parse(currentUserData);
              const userExists = users[currentUser.email];

              if (userExists && userExists.isActive) {
                setUser(currentUser);
                setUserRole(currentUser.role);
                setUserPermissions(getPermissionsForRole(currentUser.role));
                console.log('✅ User restored from session:', currentUser.email);
              } else {
                // User doesn't exist or is inactive, clear session
                localStorage.removeItem(CURRENT_USER_KEY);
              }
            } else {
              // Auto-login admin for development
              const adminUser = users['admin@petropro.com'];
              if (adminUser) {
                setUser(adminUser);
                setUserRole(adminUser.role);
                setUserPermissions(getPermissionsForRole(adminUser.role));
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
                console.log('✅ Auto admin user logged in successfully');
              }
            }
          } catch (error) {
            console.error('Error during auth initialization:', error);
          } finally {
            setLoading(false);
          }
        };

        initAuth();
      }, [initializeDefaultUsers, getPermissionsForRole]);

      const signUp = useCallback(async (email, password, options) => {
        const users = getUsers();

        // Validate input
        if (!email || !password || !options?.data?.name) {
          const error = { message: 'Name, email, and password are required' };
          toast({
            variant: "destructive",
            title: "Sign up Failed",
            description: error.message,
          });
          return { error };
        }

        // Check if user already exists
        if (users[email]) {
          const error = { message: 'User with this email already exists' };
          toast({
            variant: "destructive",
            title: "Sign up Failed",
            description: error.message,
          });
          return { error };
        }

        // Create new user
        const newUser = {
          id: 'user-' + Date.now(),
          email: email,
          password: password, // In production, this should be hashed
          name: options.data.name,
          role: 'Operator', // Default role for new users
          is_super_admin: false,
          created_at: new Date().toISOString(),
          isActive: true
        };

        // Save user
        users[email] = newUser;
        saveUsers(users);

        // Auto-login the new user
        setUser(newUser);
        setUserRole(newUser.role);
        setUserPermissions(getPermissionsForRole(newUser.role));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

        toast({
          title: "Account Created Successfully",
          description: `Welcome to PetroPro, ${newUser.name}!`,
        });

        navigate('/dashboard');
        return { data: { user: newUser }, error: null };
      }, [toast, navigate, getUsers, saveUsers, getPermissionsForRole]);

      const signIn = useCallback(async (email, password) => {
        const users = getUsers();

        // Find user
        const user = users[email];

        if (!user) {
          const error = { message: 'User not found' };
          toast({
            variant: "destructive",
            title: "Sign in Failed",
            description: error.message,
          });
          return { error };
        }

        if (!user.isActive) {
          const error = { message: 'Account is deactivated. Please contact administrator.' };
          toast({
            variant: "destructive",
            title: "Sign in Failed",
            description: error.message,
          });
          return { error };
        }

        // Check password (in production, this should be hashed and compared properly)
        if (user.password !== password) {
          const error = { message: 'Invalid password' };
          toast({
            variant: "destructive",
            title: "Sign in Failed",
            description: error.message,
          });
          return { error };
        }

        // Login successful
        setUser(user);
        setUserRole(user.role);
        setUserPermissions(getPermissionsForRole(user.role));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });

        navigate('/dashboard');
        return { data: { user }, error: null };
      }, [toast, navigate, getUsers, getPermissionsForRole]);

      const logout = useCallback(async () => {
        // Clear current user session
        localStorage.removeItem(CURRENT_USER_KEY);

        setUser(null);
        setUserPermissions([]);
        setUserRole(null);
        navigate('/login');

        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
      }, [toast, navigate]);

      const hasPermission = useCallback((permission) => {
        if (!user) return false;
        if (userRole === 'Super Admin' || userPermissions.includes('*')) {
            return true;
        }
        if (!permission) return true;
        return userPermissions.includes(permission);
      }, [user, userRole, userPermissions]);

      const value = useMemo(() => ({
        user,
        loading,
        signUp,
        signIn,
        logout,
        hasPermission,
        userRole,
        userPermissions,
      }), [user, loading, signUp, signIn, logout, hasPermission, userRole, userPermissions]);

      // Debug logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext - User:', user, 'Loading:', loading, 'Role:', userRole);
      }

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };