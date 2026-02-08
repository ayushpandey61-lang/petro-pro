import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Fuel, KeyRound, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const { orgDetails } = useOrg();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await signUp(email, password);
    if (error) {
        setError(error.message);
    } else {
        setError("Check your email for a confirmation link!");
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
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4 transition-all duration-500"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      >
        {orgDetails.loginHeader && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl text-center text-white bg-black/50 p-4 rounded-t-lg shadow-lg"
          >
            <h2 className="text-xl font-bold">{orgDetails.loginHeader}</h2>
          </motion.div>
        )}
        <div className="flex w-full items-center justify-end flex-grow">
          <motion.div 
              className="w-full max-w-md pr-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
          >
            <Card className="w-full shadow-2xl bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-blue-200 dark:border-blue-800/40">
              <CardHeader className="text-center p-6 space-y-2">
                  <div className="flex justify-center">
                      <div className="bg-blue-600 p-4 rounded-full shadow-lg">
                          <Fuel className="w-10 h-10 text-white" />
                      </div>
                  </div>
                <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('welcome_back')}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{t('login_to_your_account')}</CardDescription>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Demo Credentials:</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Email: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">demo@petropro.com</code><br />
                    Password: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">demo123</code>
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                  <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="login">Login</TabsTrigger>
                          <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                          <form onSubmit={handleLogin} className="space-y-6 pt-4">
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input 
                                  id="email-login" 
                                  type="email"
                                  placeholder="Enter your email" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="pl-10 py-6 text-base"
                                  required
                                />
                              </div>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input 
                                  id="password-login" 
                                  type="password" 
                                  placeholder="••••••••"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="pl-10 py-6 text-base"
                                  required
                                />
                              </div>
                              {error && <p className="text-sm text-center font-medium text-destructive">{error}</p>}
                              <Button type="submit" className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                {t('login')}
                              </Button>
                          </form>
                      </TabsContent>
                      <TabsContent value="signup">
                          <form onSubmit={handleSignUp} className="space-y-6 pt-4">
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input 
                                  id="email-signup" 
                                  type="email"
                                  placeholder="Enter your email" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="pl-10 py-6 text-base"
                                  required
                                />
                              </div>
                              <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input 
                                  id="password-signup" 
                                  type="password" 
                                  placeholder="Create a password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="pl-10 py-6 text-base"
                                  required
                                />
                              </div>
                              {error && <p className="text-sm text-center font-medium text-destructive">{error}</p>}
                              <Button type="submit" className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Sign Up
                              </Button>
                          </form>
                      </TabsContent>
                  </Tabs>
              </CardContent>
              <CardFooter className="p-6 pt-2 flex flex-col items-center text-center text-muted-foreground">
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="link" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                        Forgot Password?
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Password Reset</AlertDialogTitle>
                        <AlertDialogDescription>
                          To reset your password, please contact your system administrator. For security reasons, password resets are handled centrally.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>OK</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
         {orgDetails.loginFooter && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl text-center text-white bg-black/50 p-3 rounded-b-lg shadow-lg"
          >
            <p className="text-sm">{orgDetails.loginFooter}</p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Login;