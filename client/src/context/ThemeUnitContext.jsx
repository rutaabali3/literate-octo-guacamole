import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const ThemeUnitContext = createContext();

export const ThemeUnitProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('pulseforge_theme') || 'dark');
  const [unitSystem, setUnitSystem] = useState(() => localStorage.getItem('pulseforge_units') || 'metric');

  useEffect(() => {
    localStorage.setItem('pulseforge_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pulseforge_units', unitSystem);
  }, [unitSystem]);

  const toggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      await axiosClient.patch('/users/me/preferences', { theme: nextTheme });
    } catch (e) {
      // offline / unauthenticated fallback ok
    }
  };

  const toggleUnitSystem = async () => {
    const nextUnit = unitSystem === 'metric' ? 'imperial' : 'metric';
    setUnitSystem(nextUnit);
    try {
      await axiosClient.patch('/users/me/preferences', { unitSystem: nextUnit });
    } catch (e) {
      // fallback
    }
  };

  return (
    <ThemeUnitContext.Provider value={{ theme, setTheme, unitSystem, setUnitSystem, toggleTheme, toggleUnitSystem }}>
      {children}
    </ThemeUnitContext.Provider>
  );
};

export const useThemeUnit = () => useContext(ThemeUnitContext);
