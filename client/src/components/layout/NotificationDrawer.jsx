import React from 'react';
import { X, CheckCheck, Bell, Award, UserPlus, Flame } from 'lucide-react';
import { useFitnessData } from '../../context/FitnessDataContext';

const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, unreadNotifCount, markNotificationRead, markAllNotificationsRead } = useFitnessData();

  if (!isOpen) return null;

  const getIcon = (category) => {
    switch (category) {
      case 'workout_completed':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'goal_achieved':
        return <Award className="w-4 h-4 text-yellow-400" />;
      case 'new_follower':
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Notifications Feed</h2>
            {unreadNotifCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {unreadNotifCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadNotifCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No activity notifications yet. Complete a workout or log milestones!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => !item.isRead && markNotificationRead(item._id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  item.isRead
                    ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                    : 'bg-slate-800 border-blue-500/30 text-slate-200 shadow-md shadow-blue-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                    {getIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-100 truncate">{item.title}</h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
