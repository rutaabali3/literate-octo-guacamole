import React, { useState } from 'react';
import SidebarNav from './components/layout/SidebarNav';
import MobileBottomNav from './components/layout/MobileBottomNav';
import TopHeaderBar from './components/layout/TopHeaderBar';
import NotificationDrawer from './components/layout/NotificationDrawer';
import AuthModal from './components/layout/AuthModal';
import ProfileModal from './components/layout/ProfileModal';

// Views
import KpiSummaryGrid from './components/dashboard/KpiSummaryGrid';
import RecentActivityTimeline from './components/dashboard/RecentActivityTimeline';
import WorkoutCard from './components/workouts/WorkoutCard';
import WorkoutFormModal from './components/workouts/WorkoutFormModal';
import MealSectionCard from './components/nutrition/MealSectionCard';
import MacroProgressBars from './components/nutrition/MacroProgressBars';
import MealLogModal from './components/nutrition/MealLogModal';
import PersonalRecordsGrid from './components/progress/PersonalRecordsGrid';
import BodyMetricsTable from './components/progress/BodyMetricsTable';
import ProgressEntryModal from './components/progress/ProgressEntryModal';
import WorkoutVolumeChart from './components/analytics/WorkoutVolumeChart';
import MacroDistributionChart from './components/analytics/MacroDistributionChart';
import BodyCompositionChart from './components/analytics/BodyCompositionChart';
import GlobalSearchFilterView from './components/search/GlobalSearchFilterView';
import RemindersManager from './components/reminders/RemindersManager';
import ExportReportModal from './components/reports/ExportReportModal';
import PreferencesPanel from './components/settings/PreferencesPanel';
import SupportTicketPanel from './components/settings/SupportTicketPanel';

import { useAuth } from './context/AuthContext';
import { useFitnessData } from './context/FitnessDataContext';
import { useThemeUnit } from './context/ThemeUnitContext';
import { Dumbbell, Plus, Flame, Sparkles } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Filters for workouts
  const [workoutCategoryFilter, setWorkoutCategoryFilter] = useState('');

  const { user } = useAuth();
  const {
    workouts,
    nutritionLogs,
    dailyTotals,
    progressEntries,
    dashboardData,
    addWorkout,
    deleteWorkout,
    addNutrition,
    logQuickWater,
    deleteNutrition,
    addProgress,
    deleteProgress
  } = useFitnessData();
  const { unitSystem } = useThemeUnit();

  const handleOpenAddMeal = (mealType) => {
    setSelectedMealType(mealType);
    setShowMealModal(true);
  };

  const filteredWorkouts = workoutCategoryFilter
    ? workouts.filter(w => w.category === workoutCategoryFilter)
    : workouts;

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      {/* Desktop Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setShowExportModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopHeaderBar
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          onToggleNotifDrawer={() => setShowNotifDrawer(!showNotifDrawer)}
          onQuickSearch={() => setActiveTab('search')}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/20 p-6 sm:p-8">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PulseForge MERN Engine</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user ? `Welcome back, ${user.profile?.fullName || user.username}!` : 'Track Your Fitness, Nutrition & Strength'}
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                  {user?.profile?.bio || 'Real-time workout logging, macro tracking, 1RM analytics, and reactive unit conversion.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowWorkoutModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Workout</span>
                </button>
                <button
                  onClick={() => handleOpenAddMeal('Breakfast')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Meal</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <KpiSummaryGrid kpis={dashboardData?.kpis} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <WorkoutVolumeChart volumeSeries={workouts.map(w => ({ date: new Date(w.performedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }), volume: w.totalVolumeKg || 0 }))} />
                  <MacroProgressBars
                    totals={dailyTotals}
                    targets={user?.profile?.macroTargets}
                    onLogWater={logQuickWater}
                  />
                </div>
                <div className="space-y-6">
                  <MacroDistributionChart
                    macroSplit={{
                      proteinGrams: dailyTotals.proteinGrams,
                      carbsGrams: dailyTotals.carbsGrams,
                      fatGrams: dailyTotals.fatGrams
                    }}
                  />
                  <RecentActivityTimeline
                    recentWorkouts={workouts.slice(0, 5)}
                    todayNutrition={nutritionLogs.slice(0, 5)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIEW: WORKOUTS */}
          {activeTab === 'workouts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-blue-400" />
                    <span>Workout Routines ({filteredWorkouts.length})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage session volume, exercises, sets, and personal record tracking.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={workoutCategoryFilter}
                    onChange={(e) => setWorkoutCategoryFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="">All Categories</option>
                    <option value="Strength">Strength</option>
                    <option value="Cardio">Cardio</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Mobility">Mobility</option>
                    <option value="CrossFit">CrossFit</option>
                  </select>

                  <button
                    onClick={() => setShowWorkoutModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Workout</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkouts.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
                    No workout routines found. Click "Log Workout" to get started!
                  </div>
                ) : (
                  filteredWorkouts.map((w) => (
                    <WorkoutCard key={w._id} workout={w} onDelete={deleteWorkout} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIEW: NUTRITION */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              <MacroProgressBars
                totals={dailyTotals}
                targets={user?.profile?.macroTargets}
                onLogWater={logQuickWater}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MealSectionCard
                  mealType="Breakfast"
                  logs={nutritionLogs}
                  onAddMeal={handleOpenAddMeal}
                  onDeleteLog={deleteNutrition}
                />
                <MealSectionCard
                  mealType="Lunch"
                  logs={nutritionLogs}
                  onAddMeal={handleOpenAddMeal}
                  onDeleteLog={deleteNutrition}
                />
                <MealSectionCard
                  mealType="Dinner"
                  logs={nutritionLogs}
                  onAddMeal={handleOpenAddMeal}
                  onDeleteLog={deleteNutrition}
                />
                <MealSectionCard
                  mealType="Snacks"
                  logs={nutritionLogs}
                  onAddMeal={handleOpenAddMeal}
                  onDeleteLog={deleteNutrition}
                />
              </div>
            </div>
          )}

          {/* VIEW: PROGRESS */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                <div>
                  <h2 className="text-xl font-bold text-white">Body Check-Ins & PR Benchmarks</h2>
                  <p className="text-xs text-slate-400 mt-1">Track body weight delta, circumferences, and 1RM progression.</p>
                </div>
                <button
                  onClick={() => setShowProgressModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Check-In</span>
                </button>
              </div>

              <PersonalRecordsGrid
                prSummary={dashboardData?.prSummary}
                latestMetrics={progressEntries[progressEntries.length - 1]?.performanceMetrics}
              />

              <BodyCompositionChart
                weightSeries={progressEntries.map(p => ({
                  date: new Date(p.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                  weightKg: p.weightKg,
                  benchPressMaxKg: p.performanceMetrics?.benchPressMaxKg
                }))}
              />

              <BodyMetricsTable
                entries={progressEntries}
                onDelete={deleteProgress}
              />
            </div>
          )}

          {/* VIEW: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WorkoutVolumeChart volumeSeries={workouts.map(w => ({ date: new Date(w.performedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }), volume: w.totalVolumeKg || 0 }))} />
                <MacroDistributionChart
                  macroSplit={{
                    proteinGrams: dailyTotals.proteinGrams,
                    carbsGrams: dailyTotals.carbsGrams,
                    fatGrams: dailyTotals.fatGrams
                  }}
                />
              </div>
              <BodyCompositionChart
                weightSeries={progressEntries.map(p => ({
                  date: new Date(p.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                  weightKg: p.weightKg,
                  benchPressMaxKg: p.performanceMetrics?.benchPressMaxKg
                }))}
              />
            </div>
          )}

          {/* VIEW: SEARCH & COMMUNITY */}
          {activeTab === 'search' && <GlobalSearchFilterView />}

          {/* VIEW: REMINDERS */}
          {activeTab === 'reminders' && <RemindersManager />}

          {/* VIEW: SETTINGS & SUPPORT */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <PreferencesPanel />
              <SupportTicketPanel />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modal Dialogs */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <NotificationDrawer isOpen={showNotifDrawer} onClose={() => setShowNotifDrawer(false)} />
      <WorkoutFormModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        onSave={addWorkout}
      />
      <MealLogModal
        isOpen={showMealModal}
        initialMealType={selectedMealType}
        onClose={() => setShowMealModal(false)}
        onSave={addNutrition}
      />
      <ProgressEntryModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        onSave={addProgress}
      />
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}

export default App;
