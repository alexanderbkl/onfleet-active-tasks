import { useState } from 'react';
import { useWorkers } from '../hooks/useOnfleet';
import { useStore } from '../store/useStore';
import { onfleetApi } from '../services/api';

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

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ActiveTaskDetails = ({ taskId, apiKey }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadTaskDetails = async () => {
    if (!isExpanded && !task) {
      setLoading(true);
      setError(null);
      try {
        const taskData = await onfleetApi.getTaskById(apiKey, taskId);
        setTask(taskData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  const getStateLabel = (state) => {
    const states = {
      0: { label: 'Unassigned', color: 'bg-gray-500' },
      1: { label: 'Assigned', color: 'bg-blue-500' },
      2: { label: 'Active', color: 'bg-yellow-500' },
      3: { label: 'Completed', color: 'bg-green-500' }
    };
    return states[state] || { label: 'Unknown', color: 'bg-gray-400' };
  };

  return (
    <div className="mt-4 border-t border-green-300 pt-4">
      <button
        onClick={loadTaskDetails}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        <span className="flex items-center gap-2 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isExpanded ? 'Hide' : 'View'} Active Task Details
        </span>
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 animate-fadeIn">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">Error loading task details</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {task && (
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 shadow-inner space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-purple-200">
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-3xl">📋</span>
                    Task #{task.shortId}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">ID: {task.id}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 ${getStateLabel(task.state).color} text-white text-sm font-bold rounded-full shadow-md`}>
                    {getStateLabel(task.state).label}
                  </span>
                  {task.trackingURL && (
                    <a
                      href={task.trackingURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      🔗 Track Task
                    </a>
                  )}
                </div>
              </div>

              {/* Destination */}
              {task.destination && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h5 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    Destination
                  </h5>
                  <div className="space-y-1 text-sm">
                    {task.destination.address && (
                      <div className="font-medium text-gray-800">
                        {task.destination.address.number} {task.destination.address.street}
                        {task.destination.address.apartment && `, Apt ${task.destination.address.apartment}`}
                      </div>
                    )}
                    {task.destination.address && (
                      <div className="text-gray-600">
                        {task.destination.address.city}, {task.destination.address.state} {task.destination.address.postalCode}
                      </div>
                    )}
                    {task.destination.location && (
                      <div className="mt-2">
                        {formatLocation(task.destination.location)}
                      </div>
                    )}
                    {task.destination.notes && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-gray-700 italic">
                        📝 {task.destination.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recipient Info */}
              {task.recipients && task.recipients.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h5 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    Recipient{task.recipients.length > 1 ? 's' : ''}
                  </h5>
                  {task.recipients.map((recipient, idx) => (
                    <div key={idx} className="text-sm space-y-1">
                      <div className="font-medium text-gray-800">{recipient.name}</div>
                      <div className="text-gray-600">📞 {recipient.phone}</div>
                      {recipient.notes && (
                        <div className="text-gray-500 italic">💬 {recipient.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Timeline */}
              {task.completionDetails && task.completionDetails.events && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h5 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    Task Timeline
                  </h5>
                  <div className="space-y-2">
                    {task.completionDetails.events.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <div className="flex-shrink-0 w-24 text-gray-500 font-medium">
                          {formatDate(event.time)}
                        </div>
                        <div className="flex-grow">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold uppercase">
                            {event.name}
                          </span>
                          {event.location && (
                            <div className="mt-1 text-xs">
                              {formatLocation(event.location)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completion Details */}
              {task.completionDetails && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h5 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    Completion Details
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 font-semibold ${task.completionDetails.success ? 'text-green-600' : 'text-red-600'}`}>
                        {task.completionDetails.success ? '✓ Success' : '✗ Failed'}
                      </span>
                    </div>
                    {task.completionDetails.distance && (
                      <div>
                        <span className="text-gray-600">Distance:</span>
                        <span className="ml-2 font-medium">{(task.completionDetails.distance / 1000).toFixed(2)} km</span>
                      </div>
                    )}
                    {task.completionDetails.time && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Completed:</span>
                        <span className="ml-2 font-medium">{formatDate(task.completionDetails.time)}</span>
                      </div>
                    )}
                    {task.completionDetails.notes && (
                      <div className="col-span-2 p-2 bg-green-50 rounded">
                        <span className="text-gray-600">Notes:</span>
                        <p className="mt-1 text-gray-700">{task.completionDetails.notes}</p>
                      </div>
                    )}
                    {task.completionDetails.photoUploadIds && task.completionDetails.photoUploadIds.length > 0 && (
                      <div className="col-span-2">
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                          📷 {task.completionDetails.photoUploadIds.length} Photo{task.completionDetails.photoUploadIds.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {task.completionDetails.signatureUploadId && (
                      <div className="col-span-2">
                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">
                          ✍️ Signature Captured
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-3">
                {task.notes && (
                  <div className="col-span-2 bg-white rounded-lg p-3 shadow-md">
                    <span className="text-sm font-semibold text-gray-700">📝 Task Notes:</span>
                    <p className="mt-1 text-sm text-gray-600">{task.notes}</p>
                  </div>
                )}
                
                {task.metadata && task.metadata.length > 0 && (
                  <div className="col-span-2 bg-white rounded-lg p-3 shadow-md">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">🏷️ Metadata:</span>
                    <div className="space-y-1">
                      {task.metadata.map((meta, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium text-gray-600">{meta.name}:</span>
                          <span className="ml-2 text-gray-800">{meta.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg p-3 shadow-md">
                  <span className="text-xs text-gray-600">Created</span>
                  <p className="text-sm font-medium">{formatDate(task.timeCreated)}</p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-md">
                  <span className="text-xs text-gray-600">Last Modified</span>
                  <p className="text-sm font-medium">{formatDate(task.timeLastModified)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
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
  
  // Sort workers by timeLastSeen (descending - most recent first)
  const sortByLastSeen = (a, b) => {
    const aTime = a.timeLastSeen || 0;
    const bTime = b.timeLastSeen || 0;
    return bTime - aTime; // Descending order (most recent first)
  };
  
  // Separate active workers by whether they have an active task
  const workersWithActiveTasks = activeWorkers.filter(w => w.activeTask).sort(sortByLastSeen);
  const workersWithoutActiveTasks = activeWorkers.filter(w => !w.activeTask).sort(sortByLastSeen);
  const sortedInactiveWorkers = [...inactiveWorkers].sort(sortByLastSeen);

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
                                {worker.userData.deviceDescription.includes('(') 
                                  ? worker.userData.deviceDescription.split('(')[0].trim()
                                  : worker.userData.deviceDescription}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Active Task Details */}
                    {worker.activeTask && apiKey && (
                      <ActiveTaskDetails taskId={worker.activeTask} apiKey={apiKey} />
                    )}
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
          {sortedInactiveWorkers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">
                ⏹️ Off Duty ({sortedInactiveWorkers.length})
              </h3>
              <div className="space-y-3">
                {sortedInactiveWorkers.map((worker) => (
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
