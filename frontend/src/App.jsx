import './index.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TopicList from './components/TopicList';
import QuestionDetailDrawer from './components/QuestionDetailDrawer';
import { ThemeProvider } from './context/ThemeContext';
import { DrawerProvider } from './context/DrawerContext';
import { useState } from 'react';
import { useTrackerStore } from './store/useTrackerStore';

function AppContent() {
  const [newTopic, setNewTopic] = useState('');
  const addTopic = useTrackerStore(state => state.addTopic);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    await addTopic(newTopic.trim());
    setNewTopic('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-[rgb(245,124,6)] selection:text-white">
      <Header />

      <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Hero Section */}
        <HeroSection />

        {/* Add Topic Bar */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl card-3d border border-[rgb(255,237,213)] dark:border-zinc-800 p-4">
          <form onSubmit={handleAddTopic} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[rgb(245,124,6)] pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              <input
                className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(245,124,6)] focus:border-transparent transition-all bg-[rgb(255,237,213)]/20 dark:bg-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
                placeholder="Add new DSA category or topic (e.g. Dynamic Programming, Tries)..."
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={!newTopic.trim()}
              className="px-5 py-2.5 btn-3d text-white text-xs sm:text-sm font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Topic</span>
            </button>
          </form>
        </div>

        {/* Main Topic List */}
        <TopicList />
      </main>

      {/* Slide-out detail panel for selected question */}
      <QuestionDetailDrawer />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center text-xs text-slate-500 dark:text-zinc-500 transition-colors">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold">
            <span className="text-slate-900 dark:text-white">Sheet</span>
            <span className="text-[rgb(245,124,6)]">Track</span> • Codolio DSA Question Tracker
          </span>
          <span>Double-click any title to edit • Click row for notes • Drag to reorder</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DrawerProvider>
        <AppContent />
      </DrawerProvider>
    </ThemeProvider>
  );
}
