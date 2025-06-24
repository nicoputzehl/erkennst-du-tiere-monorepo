import { BookOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "Wählen Sie ein Quiz aus der Sidebar aus oder erstellen Sie ein neues Quiz" 
}) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <BookOpen 
          size={64} 
          className="mx-auto text-gray-400 dark:text-gray-500 mb-4" 
        />
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Quiz Editor
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
          {message}
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 dark:text-gray-500">
          <Plus size={16} />
          <span>Erstellen Sie Ihr erstes Quiz</span>
        </div>
      </div>
    </div>
  );
};