import React, { useState } from 'react';
import { Bell, Plus, Trash2, Clock, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { useFitnessData } from '../../context/FitnessDataContext';

const RemindersManager = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useFitnessData();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Workout');
  const [timeOfDay, setTimeOfDay] = useState('07:30');
  const [daysOfWeek, setDaysOfWeek] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Enter reminder title');
    await addReminder({ title, type, timeOfDay, daysOfWeek });
    setTitle('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <span>Reminders & Training Alerts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automate workout notifications, meal prep timing, and hydration reminders.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Alert</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 bg-slate-800/50 rounded-2xl border border-slate-800">
            No reminders scheduled yet. Add your workout or hydration alarms!
          </div>
        ) : (
          reminders.map((r) => (
            <div
              key={r._id}
              className={`p-4 rounded-2xl border transition-all ${
                r.enabled
                  ? 'bg-slate-800/90 border-slate-700'
                  : 'bg-slate-800/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-blue-400 border border-slate-700">
                    {r.type}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{r.title}</h4>
                  <p className="text-sm font-mono text-slate-300 mt-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {r.timeOfDay}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReminder(r._id)}
                    title={r.enabled ? 'Pause Reminder' : 'Enable Reminder'}
                    className="text-slate-300 hover:text-white"
                  >
                    {r.enabled ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-500" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteReminder(r._id)}
                    title="Delete Reminder"
                    className="p-1 text-slate-500 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-4">
                {allDays.map((d) => (
                  <span
                    key={d}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.daysOfWeek?.includes(d)
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                        : 'bg-slate-900/60 text-slate-600'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create Scheduled Alert</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening Gym Session"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="Workout">Workout</option>
                    <option value="Meal">Meal</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Goal">Goal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time of Day</label>
                  <input
                    type="time"
                    required
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Days of Week</label>
                <div className="flex justify-between">
                  {allDays.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        daysOfWeek.includes(d)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Schedule Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersManager;
