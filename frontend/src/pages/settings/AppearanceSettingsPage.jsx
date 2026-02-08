import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Save, Image as ImageIcon, Trash2, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { Input } from '@/components/ui/input';
import { useOrg } from '@/hooks/useOrg';

const ColorPicker = ({ label, color, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group">
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-600 shadow-lg transition-transform group-hover:scale-110"
        style={{ backgroundColor: color }}
      ></div>
      <div>
        <Label className="text-lg font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
        <p className="text-sm text-slate-500 dark:text-slate-400">{color}</p>
      </div>
    </div>
    <div className="relative">
      <div className="w-10 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 overflow-hidden cursor-pointer hover:border-blue-400 transition-colors">
        <div className="w-full h-full" style={{ backgroundColor: color }}></div>
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  </div>
);

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToHsl = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return `${h} ${s}% ${l}%`;
};

const ColorPaletteEditor = ({ title, defaultColors, themeKey }) => {
  const { toast } = useToast();
  const { colors: globalColors, updateColors } = useTheme();
  const [localColors, setLocalColors] = useState(globalColors[themeKey]);

  useEffect(() => {
    setLocalColors(globalColors[themeKey]);
  }, [globalColors, themeKey]);
  
  const handleColorChange = (variable, hexValue) => {
    const hslValue = hexToHsl(hexValue);
    setLocalColors(prev => ({ ...prev, [variable]: hslValue }));
  };
  
  const handleSave = () => {
    updateColors(themeKey, localColors);
    toast({ title: "Palette Saved", description: `${title} have been updated.` });
  };
  
  const handleReset = () => {
    setLocalColors(defaultColors);
    updateColors(themeKey, defaultColors);
    toast({ title: "Palette Reset", description: `${title} colors have been reset to default.` });
  };
  
  const colorVariables = [
    { label: 'Primary', var: '--primary' },
    { label: 'Background', var: '--background' },
    { label: 'Card', var: '--card' },
    { label: 'Header Background', var: '--header-background' },
    { label: 'Header Text/Icons', var: '--header-foreground' },
    { label: 'Accent', var: '--accent' },
    { label: 'Destructive', var: '--destructive' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="premium-card border-2 border-gradient overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription className="text-slate-300 mt-1">
                Fine-tune your color palette for the perfect look
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Palette className="h-6 w-6" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid gap-6">
            {colorVariables.map(({ label, var: cssVar }, index) => (
              <motion.div
                key={cssVar}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <ColorPicker
                  label={label}
                  color={hslToHex(...(localColors[cssVar] || '0 0% 0%').split(' ').map(parseFloat))}
                  onChange={(hex) => handleColorChange(cssVar, hex)}
                />
              </motion.div>
            ))}
          </div>

          {/* Color Preview */}
          <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Live Preview</h4>
            <div className="flex gap-4 flex-wrap">
              {colorVariables.slice(0, 5).map(({ label, var: cssVar }) => (
                <div key={cssVar} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-lg"
                    style={{ backgroundColor: hslToHex(...(localColors[cssVar] || '0 0% 0%').split(' ').map(parseFloat)) }}
                  ></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end bg-slate-50 dark:bg-slate-800/50">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Save className="mr-2 h-5 w-5" /> Save Color Palette
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const AppearanceSettingsPage = () => {
  const { toast } = useToast();
  const { theme, setTheme, defaultLightColors, defaultDarkColors } = useTheme();
  const { orgDetails, setOrgDetails } = useOrg();
  
  const [localTheme, setLocalTheme] = useState(theme);
  const [loginSettings, setLoginSettings] = useState({
      loginBackgroundUrl: '',
      loginHeader: '',
      loginFooter: '',
  });

  useEffect(() => {
    setLoginSettings({
      loginBackgroundUrl: orgDetails.loginBackgroundUrl || '',
      loginHeader: orgDetails.loginHeader || '',
      loginFooter: orgDetails.loginFooter || '',
    });
  }, [orgDetails]);

  const handleThemeChange = (checked) => {
    setLocalTheme(checked ? 'dark' : 'light');
  };
  
  const saveTheme = () => {
    setTheme(localTheme);
    toast({
      title: "Theme Saved!",
      description: `Switched to ${localTheme} mode.`,
    });
  };

  const handleLoginSettingsChange = (e) => {
    const { id, value } = e.target;
    setLoginSettings(prev => ({...prev, [id]: value}));
  };

  const handleLoginBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoginSettings(prev => ({...prev, loginBackgroundUrl: reader.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLoginBg = () => {
    setLoginSettings(prev => ({...prev, loginBackgroundUrl: ''}));
  };

  const saveLoginSettings = () => {
    setOrgDetails(prev => ({ ...prev, ...loginSettings }));
    toast({ title: "Login Page Updated", description: "Your customizations for the login page have been saved." });
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Palette className="h-8 w-8" />
              </div>
              Appearance Settings
            </h1>
            <p className="text-blue-100 text-lg">Customize your application theme and visual experience</p>
          </motion.div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Theme Toggle - Enhanced */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="premium-card border-2 border-gradient">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  Theme Mode
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Switch between light and dark themes
                </CardDescription>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Palette className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${localTheme === 'light' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    <Palette className="h-6 w-6" />
                  </div>
                  <div>
                    <Label htmlFor="dark-mode" className="text-xl font-semibold cursor-pointer">
                      {localTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {localTheme === 'dark' ? 'Professional dark interface' : 'Clean and bright interface'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={localTheme === 'dark'}
                  onCheckedChange={handleThemeChange}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-6">
              <Button
                onClick={saveTheme}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="mr-2 h-5 w-5" /> Save Theme
              </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Login Customization - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="premium-card border-2 border-gradient overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Login Page Branding</CardTitle>
                <CardDescription className="text-indigo-100 mt-1">
                  Customize your login experience with premium branding
                </CardDescription>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ImageIcon className="h-8 w-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label htmlFor="loginHeader" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                      Welcome Header
                    </Label>
                    <Input
                      id="loginHeader"
                      value={loginSettings.loginHeader}
                      onChange={handleLoginSettingsChange}
                      placeholder="e.g., Welcome to Vinit Petro Pro"
                      className="form-input text-lg py-4"
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="loginFooter" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                      Footer Text
                    </Label>
                    <Input
                      id="loginFooter"
                      value={loginSettings.loginFooter}
                      onChange={handleLoginSettingsChange}
                      placeholder="e.g., © 2025 Vinit Petro Pro. All Rights Reserved."
                      className="form-input text-lg py-4"
                    />
                </div>
              </div>

              {/* Background Image Section */}
              <div className="space-y-4">
                  <Label className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Background Image
                  </Label>
                  <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border-2 border-blue-200/50 dark:border-blue-800/50">
                      <div className="relative w-32 h-24 rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-800 overflow-hidden shadow-lg">
                          {loginSettings.loginBackgroundUrl ?
                            <img src={loginSettings.loginBackgroundUrl} alt="Login background preview" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                                <ImageIcon className="w-10 h-10 text-blue-400" />
                              </div>
                          }
                          {loginSettings.loginBackgroundUrl && (
                            <div className="absolute top-1 right-1">
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-6 w-6 rounded-full"
                                onClick={removeLoginBg}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                      </div>
                      <div className="flex-grow">
                          <Input id="login-bg-upload" type="file" accept="image/*" onChange={handleLoginBgUpload} className="hidden" />
                          <div className="space-y-3">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Upload a high-quality background image for your login page
                            </p>
                            <Button asChild variant="outline" className="form-button-outline">
                                <Label htmlFor="login-bg-upload" className="cursor-pointer">
                                  <ImageIcon className="mr-2 h-5 w-5" /> Choose Background Image
                                </Label>
                            </Button>
                          </div>
                      </div>
                  </div>
              </div>
          </CardContent>
          <CardFooter className="flex justify-end bg-slate-50 dark:bg-slate-800/50">
              <Button
                onClick={saveLoginSettings}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="mr-2 h-5 w-5" /> Save Branding
              </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <ColorPaletteEditor
          title="Light Mode Colors"
          themeKey="light"
          defaultColors={defaultLightColors}
        />
        <ColorPaletteEditor
          title="Dark Mode Colors"
          themeKey="dark"
          defaultColors={defaultDarkColors}
        />
      </div>
    </motion.div>
  );
};

export default AppearanceSettingsPage;