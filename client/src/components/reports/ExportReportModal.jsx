import React, { useState } from 'react';
import { X, FileSpreadsheet, Printer, Download, Check } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { downloadCsvBlob, triggerPrintReport } from '../../utils/exportHelpers';

const ExportReportModal = ({ isOpen, onClose }) => {
  const [scope, setScope] = useState('all');
  const [range, setRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCsv = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/reports/export', {
        params: { format: 'csv', scope, range },
        responseType: 'text'
      });
      downloadCsvBlob(res.data, `pulseforge-${scope}-${range}.csv`);
    } catch (err) {
      console.error(err);
      alert('Failed to export CSV report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    triggerPrintReport();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Export Fitness Report</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Generate your personalized workout routines, nutrition logs, and body composition data for spreadsheet analysis (CSV) or doctor/trainer printouts (PDF).
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dataset Scope</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="all">Complete Dataset (All)</option>
                <option value="workouts">Workouts Only</option>
                <option value="nutrition">Nutrition Logs Only</option>
                <option value="progress">Progress Check-Ins Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time Horizon</label>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="all">Full Account Lifetime</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadCsv}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{loading ? 'Generating...' : 'Download CSV'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReportModal;
