import './index.css';
import Header from './components/Header';
import TopicList from './components/TopicList';
import { useState } from 'react';
import { useTrackerStore } from './store/useTrackerStore';

function App() {
  const [newTopic, setNewTopic] = useState('');
  const addTopic = useTrackerStore(state => state.addTopic);

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    await addTopic(newTopic.trim());
    setNewTopic('');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Header />

      <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Add Topic Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 p-3.5">
          <form onSubmit={handleAddTopic} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              <input
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                placeholder="Add new DSA category or topic (e.g. Dynamic Programming, Tries)..."
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={!newTopic.trim()}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Topic</span>
            </button>
          </form>
        </div>

        {/* Main Topic List */}
        <TopicList />
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Codolio Question Tracker • Full-Stack DSA Interview Preparation</span>
          <span>Double-click any item to edit • Drag & drop to reorder</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
