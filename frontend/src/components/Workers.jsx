import { useWorkers } from '../hooks/useOnfleet';
import { useStore } from '../store/useStore';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const formatBattery = (level) => {
  if (level === null || level === undefined) return 'N/A';
  const percentage = Math.round(level * 100);
  let color = 'text-green-600';
  if (percentage < 20) color = 'text-red-600';
  else if (percentage < 50) color = 'text-yellow-600';
  return <span className={`font-semibold ${color}`}>{percentage}%</span>;
};

const formatLocation = (location) => {
  if (!location || !Array.isArray(location) || location.length < 2) return null;
  const [lng, lat] = location;
  return (
    <a 
      href={`https://www.google.com/maps?q=${lat},${lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline text-sm"
    >
      📍 {lat.toFixed(4)}, {lng.toFixed(4)}
    </a>
  );
};

export const Workers = () => {
  const { apiKey } = useStore();
  const { data: workers, isLoading, isError, error, refetch } = useWorkers(apiKey);

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
  
  // Separate active workers by whether they have an active task
  const workersWithActiveTasks = activeWorkers.filter(w => w.activeTask);
  const workersWithoutActiveTasks = activeWorkers.filter(w => !w.activeTask);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Workers / Drivers</h2>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
        >
          🔄 Refresh
        </button>
      </div>
      
      {workers && workers.length > 0 ? (
        <div className="space-y-6">
          {/* Workers with Active Tasks */}
          {workersWithActiveTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">
                🚗 Active & Working ({workersWithActiveTasks.length})
              </h3>
              <div className="space-y-3">
                {workersWithActiveTasks.map((worker) => (
                  <div key={worker.id} className="border-2 border-green-400 bg-green-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Main Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{worker.name}</h4>
                            <p className="text-xs text-gray-500">ID: {worker.id}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                              ON DUTY
                            </span>
                            <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                              ACTIVE TASK
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                          <div>
                            <span className="text-gray-600">📞 Phone:</span>
                            <span className="ml-2 font-medium">{worker.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">📦 Total Tasks:</span>
                            <span className="ml-2 font-semibold text-blue-600">{worker.taskCount || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">👁️ Last Seen:</span>
                            <span className="ml-2 font-medium">{formatTimestamp(worker.timeLastSeen)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">🔋 Battery:</span>
                            <span className="ml-2">{formatBattery(worker.userData?.batteryLevel)}</span>
                          </div>
                          {worker.location && (
                            <div className="col-span-2">
                              <span className="text-gray-600">Location:</span>
                              <span className="ml-2">{formatLocation(worker.location)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Vehicle & Device Info */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        {worker.vehicle && (
                          <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-700 mb-1">🚙 Vehicle</p>
                            <p className="text-sm">{worker.vehicle.type || 'N/A'}</p>
                            {worker.vehicle.licensePlate && (
                              <p className="text-xs text-gray-600">{worker.vehicle.licensePlate}</p>
                            )}
                          </div>
                        )}
                        {worker.userData && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">📱 Device</p>
                            <p className="text-xs text-gray-600">{worker.userData.platform || 'N/A'}</p>
                            {worker.userData.deviceDescription && (
                              <p className="text-xs text-gray-500 truncate" title={worker.userData.deviceDescription}>
                                {worker.userData.deviceDescription.split('(')[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Workers On Duty but No Active Task */}
          {workersWithoutActiveTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-yellow-600 mb-3">
                ⏸️ On Duty - Available ({workersWithoutActiveTasks.length})
              </h3>
              <div className="space-y-3">
                {workersWithoutActiveTasks.map((worker) => (
                  <div key={worker.id} className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Main Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{worker.name}</h4>
                            <p className="text-xs text-gray-500">ID: {worker.id}</p>
                          </div>
                          <span className="inline-block px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                            AVAILABLE
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                          <div>
                            <span className="text-gray-600">📞 Phone:</span>
                            <span className="ml-2 font-medium">{worker.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">📦 Tasks:</span>
                            <span className="ml-2 font-semibold">{worker.taskCount || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">👁️ Last Seen:</span>
                            <span className="ml-2 font-medium">{formatTimestamp(worker.timeLastSeen)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">🔋 Battery:</span>
                            <span className="ml-2">{formatBattery(worker.userData?.batteryLevel)}</span>
                          </div>
                          {worker.location && (
                            <div className="col-span-2">
                              <span className="text-gray-600">Location:</span>
                              <span className="ml-2">{formatLocation(worker.location)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Vehicle & Device Info */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        {worker.vehicle && (
                          <div className="mb-2">
                            <p className="text-xs font-semibold text-gray-700 mb-1">🚙 Vehicle</p>
                            <p className="text-sm">{worker.vehicle.type || 'N/A'}</p>
                            {worker.vehicle.licensePlate && (
                              <p className="text-xs text-gray-600">{worker.vehicle.licensePlate}</p>
                            )}
                          </div>
                        )}
                        {worker.userData && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">📱 Device</p>
                            <p className="text-xs text-gray-600">{worker.userData.platform || 'N/A'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Inactive Workers */}
          {inactiveWorkers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">
                ⏹️ Off Duty ({inactiveWorkers.length})
              </h3>
              <div className="space-y-3">
                {inactiveWorkers.map((worker) => (
                  <div key={worker.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{worker.name}</h4>
                        <p className="text-xs text-gray-500">ID: {worker.id}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                          <div>
                            <span className="text-gray-600">📞 {worker.phone || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">👁️ {formatTimestamp(worker.timeLastSeen)}</span>
                          </div>
                        </div>
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
