import { useWorkers } from '../hooks/useOnfleet';
import { useStore } from '../store/useStore';

export const Workers = () => {
  const { apiKey } = useStore();
  const { data: workers, isLoading, isError, error } = useWorkers(apiKey);

  if (!apiKey) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Workers / Drivers</h2>
        <p className="text-gray-600">Please enter an API key to view workers.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Workers / Drivers</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Workers / Drivers</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading workers</p>
          <p className="text-sm">{error?.message || 'An error occurred'}</p>
        </div>
      </div>
    );
  }

  const activeWorkers = workers?.filter(worker => worker.onDuty) || [];
  const inactiveWorkers = workers?.filter(worker => !worker.onDuty) || [];

  const logWorkers = () => {
    console.log('Workers data:', workers);
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Workers / Drivers</h2>
      <button onClick={logWorkers} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Log Workers Data
      </button>
      
      {workers && workers.length > 0 ? (
        <div className="space-y-6">
          {activeWorkers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">Active Workers ({activeWorkers.length})</h3>
              <div className="space-y-3">
                {activeWorkers.map((worker) => (
                  <div key={worker.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{worker.name}</h4>
                        <p className="text-sm text-gray-600">ID: {worker.id}</p>
                        <p className="text-sm text-gray-600">Phone: {worker.phone || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          ON DUTY
                        </span>
                        {worker.tasks && (
                          <p className="text-sm text-gray-600 mt-2">
                            Tasks: <span className="font-semibold">{worker.tasks.length}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {inactiveWorkers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">Inactive Workers ({inactiveWorkers.length})</h3>
              <div className="space-y-3">
                {inactiveWorkers.map((worker) => (
                  <div key={worker.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{worker.name}</h4>
                        <p className="text-sm text-gray-600">ID: {worker.id}</p>
                        <p className="text-sm text-gray-600">Phone: {worker.phone || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">
                          OFF DUTY
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">No workers found.</p>
      )}
    </div>
  );
};
