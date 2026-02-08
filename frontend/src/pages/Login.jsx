import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Fuel, KeyRound, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrg } from '@/hooks/useOrg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp } = useAuth();
  const { orgDetails } = useOrg();

  // Load remembered username on component mount
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  // Form validation
  const validateForm = (isSignUp = false) => {
    const usernameRegex = /^[a-zA-Z0-9@._-]+$/;

    if (!username.trim()) {
      setError('Username is required');
      return false;
    }

    if (!usernameRegex.test(username)) {
      setError('Username can contain letters, numbers, @, ., _, and -');
      return false;
    }

    if (!password.trim()) {
      setError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('Name is required');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateForm(false)) {
      setLoading(false);
      return;
    }

    // Handle remember me
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    try {
      const { error } = await signIn(username, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Login successful! Redirecting...');
        // Clear form on successful login
        setUsername('');
        setPassword('');
        setRememberMe(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setUsername('admin@petropro.com');
    setPassword('admin');
    setRememberMe(false);
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await signIn('admin@petropro.com', 'admin');
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Admin login successful! Redirecting...');
      }
    } catch (err) {
      setError('Admin login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateForm(true)) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, { data: { name } });
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Account created successfully! You can now log in.');
        setActiveTab('login');
        // Clear form
        setName('');
        setConfirmPassword('');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const backgroundImageUrl = orgDetails.loginBackgroundUrl || `https://images.unsplash.com/photo-1554966624-4685918721af?q=80&w=1920&auto=format&fit=crop`;

  return (
    <>
      <Helmet>
        <title>Login - PetroPro</title>
        <meta name="description" content="Login or Sign Up to access the PetroPro management system." />
      </Helmet>
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4 transition-all duration-500 relative"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Header */}
        {orgDetails.loginHeader && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl text-center text-white bg-black/60 p-6 rounded-t-xl shadow-2xl backdrop-blur-md border-b border-white/20 relative z-10"
          >
            <h2 className="text-2xl font-bold">{orgDetails.loginHeader}</h2>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex w-full items-center justify-end flex-grow relative z-10">
          <motion.div
              className="w-full max-w-md mx-4 mr-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="w-full shadow-2xl bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-blue-200 dark:border-blue-800/40">
              <CardHeader className="text-center p-8 space-y-4">
                  <motion.div
                    className="flex justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-full shadow-xl">
                          <Fuel className="w-12 h-12 text-white" />
                      </div>
                  </motion.div>
                <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Welcome to PetroPro
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                  Sign in to your account to continue
                </CardDescription>

                {/* Demo Credentials */}
                <motion.div
                  className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200 dark:border-blue-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Demo Credentials:</p>
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <p><span className="font-medium">Username:</span> <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-800 dark:text-blue-200">admin@petropro.com</code></p>
                    <p><span className="font-medium">Password:</span> <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-800 dark:text-blue-200">admin</code></p>
                  </div>
                </motion.div>
              </CardHeader>
              <CardContent className="p-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                          <TabsTrigger value="login" className="text-base font-medium">Login</TabsTrigger>
                          <TabsTrigger value="signup" className="text-base font-medium">Sign Up</TabsTrigger>
                      </TabsList>

                      {/* Error/Success Messages */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                          </motion.div>
                        )}
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <TabsContent value="login" className="space-y-6">
                          <form onSubmit={handleLogin} id="admin-login-form" className="space-y-6">
                              <div className="space-y-2">
                                <Label htmlFor="username-login" className="text-sm font-medium">Username</Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    id="username-login"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loading}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="password-login" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    id="password-login"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loading}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={loading}
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </div>

                              {/* Remember Me */}
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="remember-me"
                                  checked={rememberMe}
                                  onCheckedChange={setRememberMe}
                                  disabled={loading}
                                />
                                <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
                              </div>

                              <Button
                                type="submit"
                                className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing in...
                                  </>
                                ) : (
                                  'Sign In'
                                )}
                              </Button>

                              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                  type="button"
                                  onClick={handleAdminLogin}
                                  variant="outline"
                                  className="w-full text-base py-6 bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={loading}
                                >
                                  🚀 Quick Admin Login
                                </Button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                  Auto-fill admin credentials and login instantly
                                </p>
                              </div>
                          </form>
                      </TabsContent>
                      <TabsContent value="signup" className="space-y-6">
                          <form onSubmit={handleSignUp} className="space-y-6">
                              <div className="space-y-2">
                                <Label htmlFor="name-signup" className="text-sm font-medium">Full Name</Label>
                                <Input
                                  id="name-signup"
                                  type="text"
                                  placeholder="Enter your full name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  required
                                  disabled={loading}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="username-signup" className="text-sm font-medium">Username</Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    id="username-signup"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loading}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="password-signup" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    id="password-signup"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password (min 6 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loading}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={loading}
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="confirm-password-signup" className="text-sm font-medium">Confirm Password</Label>
                                <div className="relative">
                                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    id="confirm-password-signup"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 pr-10 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                    disabled={loading}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    disabled={loading}
                                  >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </div>

                              <Button
                                type="submit"
                                className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating Account...
                                  </>
                                ) : (
                                  'Create Account'
                                )}
                              </Button>
                          </form>
                      </TabsContent>
                  </Tabs>
              </CardContent>
              <CardFooter className="p-8 pt-4 flex flex-col items-center text-center space-y-4">
                   <AlertDialog>
                     <AlertDialogTrigger asChild>
                       <Button
                         variant="link"
                         className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium p-0 h-auto"
                         disabled={loading}
                       >
                         Forgot your password?
                       </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent className="max-w-md">
                       <AlertDialogHeader>
                         <AlertDialogTitle className="flex items-center gap-2">
                           <AlertCircle className="w-5 h-5 text-orange-500" />
                           Password Reset
                         </AlertDialogTitle>
                         <AlertDialogDescription className="text-left">
                           For security reasons, password resets are handled by your system administrator.
                           <br /><br />
                           <strong>Contact Information:</strong>
                           <ul className="mt-2 space-y-1 text-sm">
                             <li>• Email: admin@petropro.com</li>
                             <li>• Or use the admin credentials provided above</li>
                           </ul>
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogAction className="w-full">Understood</AlertDialogAction>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>

                   <div className="text-xs text-gray-500 dark:text-gray-400">
                     <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                   </div>
               </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        {orgDetails.loginFooter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-4xl text-center text-white bg-black/60 p-4 rounded-b-xl shadow-2xl backdrop-blur-md border-t border-white/20 relative z-10"
          >
            <p className="text-sm">{orgDetails.loginFooter}</p>
          </motion.div>
        )}

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-white/70 text-xs mt-4 relative z-10"
        >
          © 2025 PetroPro. All rights reserved.
        </motion.div>
      </div>
    </>
  );
};

export default Login;