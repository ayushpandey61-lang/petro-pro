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
  <div className="flex items-center justify-between">
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{color}</span>
      <div className="relative w-8 h-8 rounded-md border overflow-hidden">
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Customize the main colors for this mode.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {colorVariables.map(({ label, var: cssVar }) => (
          <ColorPicker
            key={cssVar}
            label={label}
            color={hslToHex(...(localColors[cssVar] || '0 0% 0%').split(' ').map(parseFloat))}
            onChange={(hex) => handleColorChange(cssVar, hex)}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Palette</Button>
      </CardFooter>
    </Card>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette /> Theme Settings</CardTitle>
          <CardDescription>Select your preferred color theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
            <Switch id="dark-mode" checked={localTheme === 'dark'} onCheckedChange={handleThemeChange} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button onClick={saveTheme}><Save className="mr-2 h-4 w-4" /> Save Theme</Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Login Page Customization</CardTitle>
            <CardDescription>Customize the header, footer, and background of the login page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="loginHeader">Login Page Header</Label>
                <Input id="loginHeader" value={loginSettings.loginHeader} onChange={handleLoginSettingsChange} placeholder="e.g., Welcome to Our Portal!"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="loginFooter">Login Page Footer</Label>
                <Input id="loginFooter" value={loginSettings.loginFooter} onChange={handleLoginSettingsChange} placeholder="e.g., © 2025 Company Name. All Rights Reserved."/>
            </div>
            <div className="space-y-2">
                <Label>Login Page Background</Label>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-16 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                        {loginSettings.loginBackgroundUrl ? 
                          <img src={loginSettings.loginBackgroundUrl} alt="Login background preview" className="w-full h-full object-cover" />
                          : <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        }
                    </div>
                    <div className="flex-grow">
                        <Input id="login-bg-upload" type="file" accept="image/*" onChange={handleLoginBgUpload} className="hidden" />
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Label htmlFor="login-bg-upload" className="cursor-pointer"><ImageIcon className="mr-2 h-4 w-4" /> Upload</Label>
                            </Button>
                            {loginSettings.loginBackgroundUrl && (
                                <Button variant="destructive" onClick={removeLoginBg}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button onClick={saveLoginSettings}><Save className="mr-2 h-4 w-4" /> Save Login Settings</Button>
        </CardFooter>
      </Card>

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