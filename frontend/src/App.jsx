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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-4 max-w-4xl mx-auto">
        <form onSubmit={handleAddTopic} className="flex items-center space-x-2 mb-4">
          <input
            className="flex-1 border rounded px-2 py-1"
            placeholder="New topic"
            value={newTopic}
            onChange={e => setNewTopic(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
            Add Topic
          </button>
        </form>
        <TopicList />
      </main>
    </div>
  );
}

export default App;

