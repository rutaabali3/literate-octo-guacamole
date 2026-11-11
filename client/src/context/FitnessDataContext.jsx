import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const FitnessDataContext = createContext();

export const FitnessDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [dailyTotals, setDailyTotals] = useState({ calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0, waterMl: 0 });
  const [progressEntries, setProgressEntries] = useState([]);
  const [progressDeltas, setProgressDeltas] = useState({});
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshAll = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [wRes, nRes, pRes, rRes, notifRes, dRes] = await Promise.all([
        axiosClient.get('/workouts'),
        axiosClient.get('/nutrition'),
        axiosClient.get('/progress'),
        axiosClient.get('/reminders'),
        axiosClient.get('/notifications'),
        axiosClient.get('/dashboard/summary')
      ]);

      setWorkouts(wRes.data.items || []);
      setNutritionLogs(nRes.data.logs || []);
      setDailyTotals(nRes.data.dailyTotals || { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0, waterMl: 0 });
      setProgressEntries(pRes.data.entries || []);
      setProgressDeltas(pRes.data.deltas || {});
      setReminders(rRes.data.reminders || []);
      setNotifications(notifRes.data.notifications || []);
      setUnreadNotifCount(notifRes.data.unreadCount || 0);
      setDashboardData(dRes.data);
    } catch (err) {
      console.error('Error fetching fitness data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      setWorkouts([]);
      setNutritionLogs([]);
      setProgressEntries([]);
      setReminders([]);
      setNotifications([]);
      setDashboardData(null);
    }
  }, [user]);

  // Workout actions
  const addWorkout = async (data) => {
    const res = await axiosClient.post('/workouts', data);
    await refreshAll();
    return res.data;
  };

  const deleteWorkout = async (id) => {
    await axiosClient.delete(`/workouts/${id}`);
    await refreshAll();
  };

  // Nutrition actions
  const addNutrition = async (data) => {
    const res = await axiosClient.post('/nutrition', data);
    await refreshAll();
    return res.data;
  };

  const logQuickWater = async () => {
    if (!user) return;
    try {
      await axiosClient.post('/nutrition', {
        mealType: 'Snacks',
        waterMl: 250,
        items: [{ name: 'Drinking Water (250ml)', quantity: 250, unit: 'ml', calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 }],
        notes: 'Hydration quick-log'
      });
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNutrition = async (id) => {
    await axiosClient.delete(`/nutrition/${id}`);
    await refreshAll();
  };

  // Progress actions
  const addProgress = async (data) => {
    const res = await axiosClient.post('/progress', data);
    await refreshAll();
    return res.data;
  };

  const deleteProgress = async (id) => {
    await axiosClient.delete(`/progress/${id}`);
    await refreshAll();
  };

  // Reminders actions
  const addReminder = async (data) => {
    const res = await axiosClient.post('/reminders', data);
    await refreshAll();
    return res.data;
  };

  const toggleReminder = async (id) => {
    await axiosClient.patch(`/reminders/${id}/toggle`);
    await refreshAll();
  };

  const deleteReminder = async (id) => {
    await axiosClient.delete(`/reminders/${id}`);
    await refreshAll();
  };

  // Notification actions
  const markNotificationRead = async (id) => {
    await axiosClient.patch(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    setUnreadNotifCount(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsRead = async () => {
    await axiosClient.post('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadNotifCount(0);
  };

  return (
    <FitnessDataContext.Provider
      value={{
        workouts,
        nutritionLogs,
        dailyTotals,
        progressEntries,
        progressDeltas,
        reminders,
        notifications,
        unreadNotifCount,
        dashboardData,
        loading,
        refreshAll,
        addWorkout,
        deleteWorkout,
        addNutrition,
        logQuickWater,
        deleteNutrition,
        addProgress,
        deleteProgress,
        addReminder,
        toggleReminder,
        deleteReminder,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </FitnessDataContext.Provider>
  );
};

export const useFitnessData = () => useContext(FitnessDataContext);
