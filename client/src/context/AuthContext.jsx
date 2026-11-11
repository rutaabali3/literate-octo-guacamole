import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useThemeUnit } from './ThemeUnitContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setTheme, setUnitSystem } = useThemeUnit();

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get('/users/me');
      setUser(res.data.user);
      if (res.data.user?.preferences?.theme) setTheme(res.data.user.preferences.theme);
      if (res.data.user?.preferences?.unitSystem) setUnitSystem(res.data.user.preferences.unitSystem);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('pulseforge_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('pulseforge_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await axiosClient.post('/auth/login', { usernameOrEmail, password });
    localStorage.setItem('pulseforge_token', res.data.accessToken);
    if (res.data.refreshToken) {
      localStorage.setItem('pulseforge_refresh_token', res.data.refreshToken);
    }
    setUser(res.data.user);
    if (res.data.user?.preferences?.theme) setTheme(res.data.user.preferences.theme);
    if (res.data.user?.preferences?.unitSystem) setUnitSystem(res.data.user.preferences.unitSystem);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axiosClient.post('/auth/register', userData);
    localStorage.setItem('pulseforge_token', res.data.accessToken);
    if (res.data.refreshToken) {
      localStorage.setItem('pulseforge_refresh_token', res.data.refreshToken);
    }
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('pulseforge_token');
    localStorage.removeItem('pulseforge_refresh_token');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const res = await axiosClient.put('/users/me', updates);
    setUser(res.data.user);
    return res.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, updateProfile, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
