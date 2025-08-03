import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile, updateProfile } = useAuth();
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Calculate actual theme based on theme setting
  const calculateActualTheme = (themeValue: Theme): 'light' | 'dark' => {
    if (themeValue === 'system') {
      return getSystemTheme();
    }
    return themeValue;
  };

  // Update theme and persist to profile if user is logged in
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    const actual = calculateActualTheme(newTheme);
    setActualTheme(actual);

    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actual);

    // Save to localStorage
    localStorage.setItem('theme', newTheme);

    // Save to user profile if logged in
    if (profile) {
      await updateProfile({ theme: newTheme });
    }
  };

  // Initialize theme
  useEffect(() => {
    // Priority: User profile > localStorage > system
    let initialTheme: Theme = 'system';

    if (profile?.theme) {
      initialTheme = profile.theme;
    } else {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        initialTheme = savedTheme;
      }
    }

    setThemeState(initialTheme);
    const actual = calculateActualTheme(initialTheme);
    setActualTheme(actual);

    // Apply to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actual);
  }, [profile]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newActual = getSystemTheme();
        setActualTheme(newActual);
        
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newActual);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    actualTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}