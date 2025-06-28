import  { useState } from 'react';
import {  Download, Upload } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { ExportUtils } from '../utils/exportUtils';

export const Header: React.FC = () => {
  const {   quizzes } = useQuizStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (quizzes.length === 0) {
      alert('Keine Quizzes zum Exportieren vorhanden. Erstellen Sie zuerst ein Quiz.');
      return;
    }

    setIsExporting(true);
    try {
      await ExportUtils.exportQuizzes(quizzes);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    alert('Import-Funktionalität wird in der nächsten Version implementiert.');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Quiz Editor
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {quizzes.length} Quiz{quizzes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
        type='button'
          onClick={handleImport}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Upload size={16} />
          <span>Importieren</span>
        </button>

        <button
        type='button'
          onClick={handleExport}
          disabled={isExporting || quizzes.length === 0}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          <span>{isExporting ? 'Exportiere...' : 'Exportieren'}</span>
        </button>

      </div>
    </header>
  );
};