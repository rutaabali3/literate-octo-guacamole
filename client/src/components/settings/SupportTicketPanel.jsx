import React, { useState, useEffect } from 'react';
import { HelpCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const SupportTicketPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Bug Report');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await axiosClient.get('/support/tickets');
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return alert('Please enter subject and description');
    setSubmitting(true);
    try {
      await axiosClient.post('/support/tickets', {
        subject,
        category,
        priority,
        description
      });
      setSubject('');
      setDescription('');
      setMsg('Support ticket logged successfully! Staff will respond shortly.');
      await fetchTickets();
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>Help Desk & Issue Ticket Tracker</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Need assistance or encountered a bug? Submit a support ticket directly to our engineering team.
        </p>

        {msg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Account & Privacy">Account & Privacy</option>
                <option value="General Help">General Help</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows="2"
              required
              placeholder="Describe what occurred, steps to reproduce, or feature idea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white">Your Submitted Tickets ({tickets.length})</h4>
        {tickets.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No tickets submitted.</p>
        ) : (
          tickets.map((t) => (
            <div key={t._id} className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{t.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">
                    {t.category}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : t.status === 'In Progress'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <p className="text-slate-300">{t.description}</p>
              {t.staffResponse && (
                <div className="p-2.5 rounded-lg bg-blue-900/30 border border-blue-800 text-blue-200">
                  <strong className="block text-[11px] font-semibold text-blue-300">Staff Response:</strong>
                  {t.staffResponse}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportTicketPanel;
