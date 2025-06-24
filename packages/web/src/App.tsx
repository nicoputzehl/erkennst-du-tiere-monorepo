import { useEffect } from 'react';
import { useQuizStore } from './store/quizStore';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

import { Header } from './components/Header';
import './index.css';

function App() {
  const { darkMode } = useQuizStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;