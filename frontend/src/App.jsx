import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiKeyInput } from './components/ApiKeyInput';
import { Teams } from './components/Teams';
import { Workers } from './components/Workers';
import { Tasks } from './components/Tasks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">Onfleet Active Tasks Manager</h1>
            <p className="text-blue-100 mt-1">Manage teams, workers, and tasks</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <ApiKeyInput />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Teams />
              <Workers />
            </div>
            
            <Tasks />
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white mt-12 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">Onfleet Active Tasks Manager - Built with React, Vite, Tailwind CSS, React Query & Zustand</p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
